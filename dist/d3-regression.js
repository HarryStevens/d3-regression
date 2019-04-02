// https://github.com/HarryStevens/d3-regression#readme Version 0.0.12. Copyright 2019 Harry Stevens.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.d3 = global.d3 || {}));
}(this, function (exports) { 'use strict';

  // Sort an array using an accessor.
  function sort(arr, fn) {
    return arr.sort(function (a, b) {
      return fn(a) - fn(b);
    });
  }

  function exponential () {
    var x = function x(d) {
      return d[0];
    },
        y = function y(d) {
      return d[1];
    },
        domain;

    function exponential(data) {
      sort(data, x);
      var n = data.length;
      var ySum = 0,
          x2ySum = 0,
          ylogySum = 0,
          xylogySum = 0,
          xySum = 0;

      for (var i = 0; i < data.length; i++) {
        var d = data[i],
            dx = x(d),
            dy = y(d);
        ySum += dy;
        x2ySum += dx * dx * dy;
        ylogySum += dy * Math.log(dy);
        xylogySum += dx * dy * Math.log(dy);
        xySum += dx * dy;
      }

      var denominator = ySum * x2ySum - xySum * xySum,
          a = Math.exp((x2ySum * ylogySum - xySum * xylogySum) / denominator),
          b = (ySum * xylogySum - xySum * ylogySum) / denominator,
          fn = function fn(x) {
        return a * Math.exp(b * x);
      }; // Calculate R squared and populate output array


      var out = [],
          SSE = 0,
          SST = 0;

      for (var _i = 0; _i < n; _i++) {
        var _d = data[_i],
            _dx = x(_d),
            _dy = y(_d),
            yComp = fn(_dx);

        SSE += Math.pow(_dy - yComp, 2);
        SST += Math.pow(_dy - ySum / n, 2);
        out[_i] = [_dx, yComp];
      }

      var rSquared = 1 - SSE / SST;

      if (domain) {
        var dx0 = domain[0],
            dx1 = domain[1];
        if (dx0 !== x(data[0])) out.unshift([dx0, fn(dx0)]);
        if (dx1 !== x(data[data.length - 1])) out.push([dx1, fn(dx1)]);
      }

      out.a = a;
      out.b = b;
      out.rSquared = rSquared;
      out.predict = fn;
      return out;
    }

    exponential.domain = function (arr) {
      return arguments.length ? (domain = arr, exponential) : domain;
    };

    exponential.x = function (fn) {
      return arguments.length ? (x = fn, exponential) : x;
    };

    exponential.y = function (fn) {
      return arguments.length ? (y = fn, exponential) : y;
    };

    return exponential;
  }

  function linear () {
    var x = function x(d) {
      return d[0];
    },
        y = function y(d) {
      return d[1];
    },
        domain;

    function linear(data) {
      var n = data.length;
      var xSum = 0,
          ySum = 0,
          xySum = 0,
          x2Sum = 0,
          minX = domain ? +domain[0] : Infinity,
          maxX = domain ? +domain[1] : -Infinity;

      for (var i = 0; i < n; i++) {
        var dx = x(data[i]),
            dy = y(data[i]);
        xSum += dx;
        ySum += dy;
        xySum += dx * dy;
        x2Sum += dx * dx;

        if (!domain) {
          if (dx < minX) minX = dx;
          if (dx > maxX) maxX = dx;
        }
      }

      var a = n * xySum,
          b = xSum * ySum,
          c = n * x2Sum,
          d = xSum * xSum,
          slope = (a - b) / (c - d),
          e = ySum,
          f = slope * xSum,
          intercept = (e - f) / n,
          fn = function fn(x) {
        return slope * x + intercept;
      }; // Calculate R squared


      var SSE = 0,
          SST = 0;

      for (var _i = 0; _i < n; _i++) {
        var _d = data[_i],
            _dx = x(_d),
            _dy = y(_d),
            yComp = fn(_dx);

        SSE += Math.pow(_dy - yComp, 2);
        SST += Math.pow(_dy - ySum / n, 2);
      }

      var rSquared = 1 - SSE / SST;
      var out = [[minX, minX * slope + intercept], [maxX, maxX * slope + intercept]];
      out.a = slope;
      out.b = intercept;
      out.rSquared = rSquared;
      out.predict = fn;
      return out;
    }

    linear.domain = function (arr) {
      return arguments.length ? (domain = arr, linear) : domain;
    };

    linear.x = function (fn) {
      return arguments.length ? (x = fn, linear) : x;
    };

    linear.y = function (fn) {
      return arguments.length ? (y = fn, linear) : y;
    };

    return linear;
  }

  // Returns the medium value of an array of numbers.
  function median(arr) {
    arr.sort(function (a, b) {
      return a - b;
    });
    var i = arr.length / 2;
    return i % 1 === 0 ? (arr[i - 1] + arr[i]) / 2 : arr[Math.floor(i)];
  }

  // Source: https://github.com/jasondavies/science.js/blob/master/src/stats/loess.js
  // License: https://github.com/jasondavies/science.js/blob/master/LICENSE

  function loess () {
    var x = function x(d) {
      return d[0];
    },
        y = function y(d) {
      return d[1];
    },
        bandwidth = .3,
        robustnessIters = 2,
        accuracy = 1e-12;

    function loess(data) {
      sort(data, x);
      var n = data.length;
      var xval = [],
          yval = [],
          weights = [];

      for (var i = 0; i < n; i++) {
        weights[i] = 1;
        var d = data[i];
        xval[i] = x(d);
        yval[i] = y(d);
      }

      finiteReal(xval);
      finiteReal(yval);
      finiteReal(weights);
      strictlyIncreasing(xval);
      var bandwidthInPoints = Math.floor(bandwidth * n);
      if (bandwidthInPoints < 2) throw {
        error: "Bandwidth too small."
      };
      var res = [],
          residuals = [],
          robustnessWeights = [];

      for (var _i = 0; _i < n; _i++) {
        res[_i] = 0;
        residuals[_i] = 0;
        robustnessWeights[_i] = 1;
      }

      var iter = -1;

      while (++iter <= robustnessIters) {
        var bandwidthInterval = [0, bandwidthInPoints - 1];
        var dx = void 0;

        for (var _i2 = 0; _i2 < n; _i2++) {
          dx = xval[_i2];

          if (_i2 > 0) {
            updateBandwidthInterval(xval, weights, _i2, bandwidthInterval);
          }

          var ileft = bandwidthInterval[0],
              iright = bandwidthInterval[1];
          var edge = xval[_i2] - xval[ileft] > xval[iright] - xval[_i2] ? ileft : iright;
          var sumWeights = 0,
              sumX = 0,
              sumXSquared = 0,
              sumY = 0,
              sumXY = 0,
              denom = Math.abs(1 / (xval[edge] - dx));

          for (var k = ileft; k <= iright; ++k) {
            var xk = xval[k],
                yk = yval[k],
                dist = k < _i2 ? dx - xk : xk - dx,
                _w = tricube(dist * denom) * robustnessWeights[k] * weights[k],
                xkw = xk * _w;

            sumWeights += _w;
            sumX += xkw;
            sumXSquared += xk * xkw;
            sumY += yk * _w;
            sumXY += yk * xkw;
          }

          var meanX = sumX / sumWeights,
              meanY = sumY / sumWeights,
              meanXY = sumXY / sumWeights,
              meanXSquared = sumXSquared / sumWeights,
              beta = Math.sqrt(Math.abs(meanXSquared - meanX * meanX)) < accuracy ? 0 : (meanXY - meanX * meanY) / (meanXSquared - meanX * meanX),
              alpha = meanY - beta * meanX;
          res[_i2] = beta * dx + alpha;
          residuals[_i2] = Math.abs(yval[_i2] - res[_i2]);
        }

        if (iter === robustnessIters) {
          break;
        }

        var medianResidual = median(residuals);

        if (Math.abs(medianResidual) < accuracy) {
          break;
        }

        var arg = void 0,
            w = void 0;

        for (var _i3 = 0; _i3 < n; _i3++) {
          arg = residuals[_i3] / (6 * medianResidual);
          robustnessWeights[_i3] = arg >= 1 ? 0 : (w = 1 - arg * arg) * w;
        }
      }

      return res.map(function (d, i) {
        return [xval[i], d];
      });
    }

    loess.bandwidth = function (n) {
      return arguments.length ? (bandwidth = n, loess) : bandwidth;
    };

    loess.x = function (fn) {
      return arguments.length ? (x = fn, loess) : x;
    };

    loess.y = function (fn) {
      return arguments.length ? (y = fn, loess) : y;
    };

    return loess;
  }

  function finiteReal(values) {
    for (var i = 0, n = values.length; i < n; i++) {
      if (!isFinite(values[i])) return false;
    }

    return true;
  }

  function strictlyIncreasing(xval) {
    for (var i = 0, n = xval.length; i < n; i++) {
      if (xval[i - 1] >= xval[i]) return false;
    }

    return true;
  }

  function tricube(x) {
    return (x = 1 - x * x * x) * x * x;
  }

  function updateBandwidthInterval(xval, weights, i, bandwidthInterval) {
    var left = bandwidthInterval[0],
        right = bandwidthInterval[1],
        nextRight = nextNonzero(weights, right);

    if (nextRight < xval.length && xval[nextRight] - xval[i] < xval[i] - xval[left]) {
      var nextLeft = nextNonzero(weights, left);
      bandwidthInterval[0] = nextLeft;
      bandwidthInterval[1] = nextRight;
    }
  }

  function nextNonzero(weights, i) {
    var j = i + 1;

    while (j < weights.length && weights[j] === 0) {
      j++;
    }

    return j;
  }

  function logarithmic () {
    var x = function x(d) {
      return d[0];
    },
        y = function y(d) {
      return d[1];
    },
        domain;

    function logarithmic(data) {
      sort(data, x);
      var n = data.length;
      var xlogSum = 0,
          yxlogSum = 0,
          ySum = 0,
          xlog2Sum = 0;

      for (var i = 0; i < n; i++) {
        var d = data[i],
            dx = x(d),
            dy = y(d);
        xlogSum += Math.log(dx);
        yxlogSum += dy * Math.log(dx);
        ySum += dy;
        xlog2Sum += Math.pow(Math.log(dx), 2);
      }

      var a = (n * yxlogSum - ySum * xlogSum) / (n * xlog2Sum - xlogSum * xlogSum),
          b = (ySum - a * xlogSum) / n,
          fn = function fn(x) {
        return a * Math.log(x) + b;
      }; // Calculate R squared and populate output array


      var out = [],
          SSE = 0,
          SST = 0;

      for (var _i = 0; _i < n; _i++) {
        var _d = data[_i],
            _dx = x(_d),
            _dy = y(_d),
            yComp = fn(_dx);

        SSE += Math.pow(_dy - yComp, 2);
        SST += Math.pow(_dy - ySum / n, 2);
        out[_i] = [_dx, yComp];
      }

      var rSquared = 1 - SSE / SST;

      if (domain) {
        var dx0 = domain[0],
            dx1 = domain[1];
        if (dx0 !== x(data[0])) out.unshift([dx0, fn(dx0)]);
        if (dx1 !== x(data[data.length - 1])) out.push([dx1, fn(dx1)]);
      }

      out.a = a;
      out.b = b;
      out.rSquared = rSquared;
      out.predict = fn;
      return out;
    }

    logarithmic.domain = function (arr) {
      return arguments.length ? (domain = arr, logarithmic) : domain;
    };

    logarithmic.x = function (fn) {
      return arguments.length ? (x = fn, logarithmic) : x;
    };

    logarithmic.y = function (fn) {
      return arguments.length ? (y = fn, logarithmic) : y;
    };

    return logarithmic;
  }

  function quadratic () {
    var x = function x(d) {
      return d[0];
    },
        y = function y(d) {
      return d[1];
    },
        domain;

    function quadratic(data) {
      sort(data, x);
      var n = data.length;
      var xSum = 0,
          ySum = 0,
          x2Sum = 0,
          x3Sum = 0,
          x4Sum = 0,
          xySum = 0,
          x2ySum = 0;

      for (var i = 0; i < n; i++) {
        var d = data[i],
            dx = x(d),
            dy = y(d),
            x2Val = Math.pow(dx, 2);
        xSum += dx;
        ySum += dy;
        x2Sum += x2Val;
        x3Sum += Math.pow(dx, 3);
        x4Sum += Math.pow(dx, 4);
        xySum += dx * dy;
        x2ySum += x2Val * dy;
      }

      var sumXX = x2Sum - Math.pow(xSum, 2) / n,
          sumXY = xySum - xSum * ySum / n,
          sumXX2 = x3Sum - x2Sum * xSum / n,
          sumX2Y = x2ySum - x2Sum * ySum / n,
          sumX2X2 = x4Sum - Math.pow(x2Sum, 2) / n,
          a = (sumX2Y * sumXX - sumXY * sumXX2) / (sumXX * sumX2X2 - Math.pow(sumXX2, 2)),
          b = (sumXY * sumX2X2 - sumX2Y * sumXX2) / (sumXX * sumX2X2 - Math.pow(sumXX2, 2)),
          c = ySum / n - b * (xSum / n) - a * (x2Sum / n),
          fn = function fn(x) {
        return a * Math.pow(x, 2) + b * x + c;
      }; // Calculate R squared and populate output array


      var out = [],
          SSE = 0,
          SST = 0;

      for (var _i = 0; _i < n; _i++) {
        var _d = data[_i],
            _dx = x(_d),
            _dy = y(_d),
            yComp = fn(_dx);

        SSE += Math.pow(_dy - yComp, 2);
        SST += Math.pow(_dy - ySum / n, 2);
        out[_i] = [_dx, yComp];
      }

      var rSquared = 1 - SSE / SST;

      if (domain) {
        var dx0 = domain[0],
            dx1 = domain[1];
        if (dx0 !== x(data[0])) out.unshift([dx0, fn(dx0)]);
        if (dx1 !== x(data[data.length - 1])) out.push([dx1, fn(dx1)]);
      }

      out.a = a;
      out.b = b;
      out.c = c;
      out.rSquared = rSquared;
      out.predict = fn;
      return out;
    }

    quadratic.domain = function (arr) {
      return arguments.length ? (domain = arr, quadratic) : domain;
    };

    quadratic.x = function (fn) {
      return arguments.length ? (x = fn, quadratic) : x;
    };

    quadratic.y = function (fn) {
      return arguments.length ? (y = fn, quadratic) : y;
    };

    return quadratic;
  }

  exports.regressionExp = exponential;
  exports.regressionLinear = linear;
  exports.regressionLoess = loess;
  exports.regressionLog = logarithmic;
  exports.regressionQuad = quadratic;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
