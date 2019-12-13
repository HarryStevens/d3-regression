// https://github.com/HarryStevens/d3-regression#readme Version 1.2.8. Copyright 2019 Harry Stevens.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.d3 = global.d3 || {}));
}(this, function (exports) { 'use strict';

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  // Adapted from vega-statistics by Jeffrey Heer
  // License: https://github.com/vega/vega/blob/f058b099decad9db78301405dd0d2e9d8ba3d51a/LICENSE
  // Source: https://github.com/vega/vega/blob/f058b099decad9db78301405dd0d2e9d8ba3d51a/packages/vega-statistics/src/regression/points.js
  function points(data, x, y, sort) {
    data = data.filter(function (d) {
      var u = x(d),
          v = y(d);
      return u != null && isFinite(u) && v != null && isFinite(v);
    });

    if (sort) {
      data.sort(function (a, b) {
        return x(a) - x(b);
      });
    }

    var n = data.length,
        X = new Float64Array(n),
        Y = new Float64Array(n); // extract values, calculate means

    var ux = 0,
        uy = 0,
        xv,
        yv,
        d;

    for (var i = 0; i < n;) {
      d = data[i];
      X[i] = xv = +x(d);
      Y[i] = yv = +y(d);
      ++i;
      ux += (xv - ux) / i;
      uy += (yv - uy) / i;
    } // mean center the data


    for (var _i = 0; _i < n; ++_i) {
      X[_i] -= ux;
      Y[_i] -= uy;
    }

    return [X, Y, ux, uy];
  }
  function visitPoints(data, x, y, cb) {
    var iterations = 0;

    for (var i = 0, n = data.length; i < n; i++) {
      var d = data[i],
          dx = x(d),
          dy = y(d);

      if (dx != null && isFinite(dx) && dy != null && isFinite(dy)) {
        cb(dx, dy, iterations++);
      }
    }
  }

  // return the coefficient of determination, or R squared.

  function determination(data, x, y, uY, predict) {
    var SSE = 0,
        SST = 0;
    visitPoints(data, x, y, function (dx, dy) {
      var sse = dy - predict(dx),
          sst = dy - uY;
      SSE += sse * sse;
      SST += sst * sst;
    });
    return 1 - SSE / SST;
  }

  // Returns the angle of a line in degrees.
  function angle(line) {
    return Math.atan2(line[1][1] - line[0][1], line[1][0] - line[0][0]) * 180 / Math.PI;
  } // Returns the midpoint of a line.

  function midpoint(line) {
    return [(line[0][0] + line[1][0]) / 2, (line[0][1] + line[1][1]) / 2];
  }

  // returns a smooth line.

  function interpose(xmin, xmax, predict) {
    var precision = .01,
        maxIter = 1e4;
    var points = [px(xmin), px(xmax)],
        iter = 0;

    while (find(points) && iter < maxIter) {
    }

    return points;

    function px(x) {
      return [x, predict(x)];
    }

    function find(points) {
      iter++;
      var n = points.length;
      var found = false;

      for (var i = 0; i < n - 1; i++) {
        var p0 = points[i],
            p1 = points[i + 1],
            m = midpoint([p0, p1]),
            mp = px(m[0]),
            a0 = angle([p0, m]),
            a1 = angle([p0, mp]),
            a = Math.abs(a0 - a1);

        if (a > precision) {
          points.splice(i + 1, 0, mp);
          found = true;
        }
      }

      return found;
    }
  }

  // Ordinary Least Squares from vega-statistics by Jeffrey Heer
  // License: https://github.com/vega/vega/blob/f058b099decad9db78301405dd0d2e9d8ba3d51a/LICENSE
  // Source: https://github.com/vega/vega/blob/f058b099decad9db78301405dd0d2e9d8ba3d51a/packages/vega-statistics/src/regression/ols.js
  function ols(uX, uY, uXY, uX2) {
    var delta = uX2 - uX * uX,
        slope = Math.abs(delta) < 1e-24 ? 0 : (uXY - uX * uY) / delta,
        intercept = uY - slope * uX;
    return [intercept, slope];
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
      var n = 0,
          Y = 0,
          YL = 0,
          XY = 0,
          XYL = 0,
          X2Y = 0,
          xmin = domain ? +domain[0] : Infinity,
          xmax = domain ? +domain[1] : -Infinity;
      visitPoints(data, x, y, function (dx, dy) {
        var ly = Math.log(dy),
            xy = dx * dy;
        ++n;
        Y += (dy - Y) / n;
        XY += (xy - XY) / n;
        X2Y += (dx * xy - X2Y) / n;
        YL += (dy * ly - YL) / n;
        XYL += (xy * ly - XYL) / n;

        if (!domain) {
          if (dx < xmin) xmin = dx;
          if (dx > xmax) xmax = dx;
        }
      });

      var _ols = ols(XY / Y, YL / Y, XYL / Y, X2Y / Y),
          _ols2 = _slicedToArray(_ols, 2),
          a = _ols2[0],
          b = _ols2[1];

      a = Math.exp(a);

      var fn = function fn(x) {
        return a * Math.exp(b * x);
      },
          out = interpose(xmin, xmax, fn);

      out.a = a;
      out.b = b;
      out.predict = fn;
      out.rSquared = determination(data, x, y, Y, fn);
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
      var n = 0,
          X = 0,
          // sum of x
      Y = 0,
          // sum of y
      XY = 0,
          // sum of x * y
      X2 = 0,
          // sum of x * x
      xmin = domain ? +domain[0] : Infinity,
          xmax = domain ? +domain[1] : -Infinity;
      visitPoints(data, x, y, function (dx, dy) {
        ++n;
        X += (dx - X) / n;
        Y += (dy - Y) / n;
        XY += (dx * dy - XY) / n;
        X2 += (dx * dx - X2) / n;

        if (!domain) {
          if (dx < xmin) xmin = dx;
          if (dx > xmax) xmax = dx;
        }
      });

      var _ols = ols(X, Y, XY, X2),
          _ols2 = _slicedToArray(_ols, 2),
          intercept = _ols2[0],
          slope = _ols2[1],
          fn = function fn(x) {
        return slope * x + intercept;
      },
          out = [[xmin, fn(xmin)], [xmax, fn(xmax)]];

      out.a = slope;
      out.b = intercept;
      out.predict = fn;
      out.rSquared = determination(data, x, y, Y, fn);
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

  // Sort an array using an accessor.
  function sort(arr, fn) {
    return arr.sort(function (a, b) {
      return fn(a) - fn(b);
    });
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
      var n = data.length,
          bw = Math.max(2, ~~(bandwidth * n)),
          // # Nearest neighbors
      xval = [],
          yval = [],
          yhat = [],
          residuals = [],
          robustWeights = []; // Slice before sort to avoid modifying input

      sort(data = data.slice(), x);

      for (var i = 0, j = 0; i < n; ++i) {
        var d = data[i],
            xi = x(d, i, data),
            yi = y(d, i, data); // Filter out points with invalid x or y values

        if (xi != null && isFinite(xi) && yi != null && isFinite(yi)) {
          xval[j] = xi;
          yval[j] = yi;
          yhat[j] = 0;
          residuals[j] = 0;
          robustWeights[j] = 1;
          ++j;
        }
      }

      var m = xval.length; // # LOESS input points

      for (var iter = -1; ++iter <= robustnessIters;) {
        var interval = [0, bw - 1];

        for (var _i = 0; _i < m; ++_i) {
          var dx = xval[_i],
              i0 = interval[0],
              i1 = interval[1],
              edge = dx - xval[i0] > xval[i1] - dx ? i0 : i1;
          var sumWeights = 0,
              sumX = 0,
              sumXSquared = 0,
              sumY = 0,
              sumXY = 0,
              denom = 1 / Math.abs(xval[edge] - dx || 1); // Avoid singularity!

          for (var k = i0; k <= i1; ++k) {
            var xk = xval[k],
                yk = yval[k],
                w = tricube(Math.abs(dx - xk) * denom) * robustWeights[k],
                xkw = xk * w;
            sumWeights += w;
            sumX += xkw;
            sumXSquared += xk * xkw;
            sumY += yk * w;
            sumXY += yk * xkw;
          } // Linear regression fit


          var meanX = sumX / sumWeights,
              meanY = sumY / sumWeights,
              meanXY = sumXY / sumWeights,
              meanXSquared = sumXSquared / sumWeights,
              beta = Math.sqrt(Math.abs(meanXSquared - meanX * meanX)) < accuracy ? 0 : (meanXY - meanX * meanY) / (meanXSquared - meanX * meanX),
              alpha = meanY - beta * meanX;
          yhat[_i] = beta * dx + alpha;
          residuals[_i] = Math.abs(yval[_i] - yhat[_i]);
          updateInterval(xval, _i + 1, interval);
        }

        if (iter === robustnessIters) {
          break;
        }

        var medianResidual = median(residuals);
        if (Math.abs(medianResidual) < accuracy) break;

        for (var _i2 = 0, arg, _w; _i2 < m; ++_i2) {
          arg = residuals[_i2] / (6 * medianResidual); // Default to accuracy epsilon (rather than zero) for large deviations
          // keeping weights tiny but non-zero prevents singularites

          robustWeights[_i2] = arg >= 1 ? accuracy : (_w = 1 - arg * arg) * _w;
        }
      }

      return output(xval, yhat);
    }

    loess.bandwidth = function (bw) {
      return arguments.length ? (bandwidth = bw, loess) : bandwidth;
    };

    loess.x = function (fn) {
      return arguments.length ? (x = fn, loess) : x;
    };

    loess.y = function (fn) {
      return arguments.length ? (y = fn, loess) : y;
    };

    return loess;
  } // Weighting kernel for local regression

  function tricube(x) {
    return (x = 1 - x * x * x) * x * x;
  } // Advance sliding window interval of nearest neighbors


  function updateInterval(xval, i, interval) {
    var val = xval[i],
        left = interval[0],
        right = interval[1] + 1;
    if (right >= xval.length) return; // Step right if distance to new right edge is <= distance to old left edge.
    // Step when distance is equal to ensure movement over duplicate x values.

    while (i > left && xval[right] - val <= val - xval[left]) {
      interval[0] = ++left;
      interval[1] = right;
      ++right;
    }
  } // Generate smoothed output points.
  // Average points with repeated x values.


  function output(xval, yhat) {
    var n = xval.length,
        out = [];

    for (var i = 0, cnt = 0, prev = [], v; i < n; ++i) {
      v = xval[i];

      if (prev[0] === v) {
        // Average output values via online update
        prev[1] += (yhat[i] - prev[1]) / ++cnt;
      } else {
        // Add new output point
        cnt = 0;
        prev = [v, yhat[i]];
        out.push(prev);
      }
    }

    return out;
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
      var n = 0,
          X = 0,
          Y = 0,
          XY = 0,
          X2 = 0,
          xmin = domain ? +domain[0] : Infinity,
          xmax = domain ? +domain[1] : -Infinity;
      visitPoints(data, x, y, function (dx, dy) {
        var lx = Math.log(dx);
        ++n;
        X += (lx - X) / n;
        Y += (dy - Y) / n;
        XY += (lx * dy - XY) / n;
        X2 += (lx * lx - X2) / n;

        if (!domain) {
          if (dx < xmin) xmin = dx;
          if (dx > xmax) xmax = dx;
        }
      });

      var _ols = ols(X, Y, XY, X2),
          _ols2 = _slicedToArray(_ols, 2),
          intercept = _ols2[0],
          slope = _ols2[1],
          fn = function fn(x) {
        return slope * Math.log(x) + intercept;
      },
          out = interpose(xmin, xmax, fn);

      out.a = slope;
      out.b = intercept;
      out.predict = fn;
      out.rSquared = determination(data, x, y, Y, fn);
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

  function quad () {
    var x = function x(d) {
      return d[0];
    },
        y = function y(d) {
      return d[1];
    },
        domain;

    function quadratic(data) {
      var _points = points(data, x, y),
          _points2 = _slicedToArray(_points, 4),
          xv = _points2[0],
          yv = _points2[1],
          ux = _points2[2],
          uy = _points2[3],
          n = xv.length;

      var X2 = 0,
          X3 = 0,
          X4 = 0,
          XY = 0,
          X2Y = 0,
          xmin = domain ? +domain[0] : Infinity,
          xmax = domain ? +domain[1] : -Infinity,
          i,
          dx,
          dy,
          x2;

      for (i = 0; i < n;) {
        dx = xv[i];
        dy = yv[i++];
        x2 = dx * dx;
        X2 += (x2 - X2) / i;
        X3 += (x2 * dx - X3) / i;
        X4 += (x2 * x2 - X4) / i;
        XY += (dx * dy - XY) / i;
        X2Y += (x2 * dy - X2Y) / i;

        if (!domain) {
          if (dx < xmin) xmin = dx;
          if (dx > xmax) xmax = dx;
        }
      }

      var X2X2 = X4 - X2 * X2,
          d = X2 * X2X2 - X3 * X3,
          a = (X2Y * X2 - XY * X3) / d,
          b = (XY * X2X2 - X2Y * X3) / d,
          c = -a * X2,
          fn = function fn(x) {
        x = x - ux;
        return a * x * x + b * x + c + uy;
      };

      var out = interpose(xmin, xmax, fn);
      out.a = a;
      out.b = b - 2 * a * ux;
      out.c = c - b * ux + a * ux * ux + uy;
      out.predict = fn;
      out.rSquared = determination(data, x, y, 0, fn);
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

  // Source: https://github.com/Tom-Alexander/regression-js/blob/master/src/regression.js#L246
  // License: https://github.com/Tom-Alexander/regression-js/blob/master/LICENSE

  function polynomial () {
    var x = function x(d) {
      return d[0];
    },
        y = function y(d) {
      return d[1];
    },
        order = 3,
        domain;

    function polynomial(data) {
      // Use more efficient methods for lower orders
      if (order === 1) {
        var o = linear().x(x).y(y).domain(domain)(data);
        o.coefficients = [o.b, o.a];
        delete o.a;
        delete o.b;
        return o;
      }

      if (order === 2) {
        var _o = quad().x(x).y(y).domain(domain)(data);

        _o.coefficients = [_o.c, _o.b, _o.a];
        delete _o.a;
        delete _o.b;
        delete _o.c;
        return _o;
      } // First pass through the data


      var arr = [],
          ySum = 0,
          minX = domain ? +domain[0] : Infinity,
          maxX = domain ? +domain[1] : -Infinity,
          n = data.length;

      for (var i = 0; i < n; i++) {
        var d = data[i],
            dx = x(d, i, data),
            dy = y(d, i, data); // Filter out points with invalid x or y values

        if (dx != null && isFinite(dx) && dy != null && isFinite(dy)) {
          arr[i] = [dx, dy];
          ySum += dy;

          if (!domain) {
            if (dx < minX) minX = dx;
            if (dx > maxX) maxX = dx;
          }
        }
      } // Update n in case there were invalid x or y values


      n = arr.length; // Calculate the coefficients

      var lhs = [],
          rhs = [],
          k = order + 1;
      var a = 0,
          b = 0;

      for (var _i = 0; _i < k; _i++) {
        for (var l = 0; l < n; l++) {
          a += Math.pow(arr[l][0], _i) * arr[l][1];
        }

        lhs.push(a);
        a = 0;
        var c = [];

        for (var j = 0; j < k; j++) {
          for (var _l = 0; _l < n; _l++) {
            b += Math.pow(arr[_l][0], _i + j);
          }

          c[j] = b;
          b = 0;
        }

        rhs.push(c);
      }

      rhs.push(lhs);

      var coefficients = gaussianElimination(rhs, k),
          fn = function fn(x) {
        return coefficients.reduce(function (sum, coeff, power) {
          return sum + coeff * Math.pow(x, power);
        }, 0);
      },
          out = interpose(minX, maxX, fn);

      out.coefficients = coefficients;
      out.predict = fn;
      out.rSquared = determination(data, x, y, ySum, fn);
      return out;
    }

    polynomial.domain = function (arr) {
      return arguments.length ? (domain = arr, polynomial) : domain;
    };

    polynomial.x = function (fn) {
      return arguments.length ? (x = fn, polynomial) : x;
    };

    polynomial.y = function (fn) {
      return arguments.length ? (y = fn, polynomial) : y;
    };

    polynomial.order = function (n) {
      return arguments.length ? (order = n, polynomial) : order;
    };

    return polynomial;
  } // Given an array representing a two-dimensional matrix,
  // and an order parameter representing how many degrees to solve for,
  // determine the solution of a system of linear equations A * x = b using
  // Gaussian elimination.

  function gaussianElimination(matrix, order) {
    var n = matrix.length - 1,
        coefficients = [order];

    for (var i = 0; i < n; i++) {
      var maxrow = i;

      for (var j = i + 1; j < n; j++) {
        if (Math.abs(matrix[i][j]) > Math.abs(matrix[i][maxrow])) {
          maxrow = j;
        }
      }

      for (var k = i; k < n + 1; k++) {
        var tmp = matrix[k][i];
        matrix[k][i] = matrix[k][maxrow];
        matrix[k][maxrow] = tmp;
      }

      for (var _j = i + 1; _j < n; _j++) {
        for (var _k = n; _k >= i; _k--) {
          matrix[_k][_j] -= matrix[_k][i] * matrix[i][_j] / matrix[i][i];
        }
      }
    }

    for (var _j2 = n - 1; _j2 >= 0; _j2--) {
      var total = 0;

      for (var _k2 = _j2 + 1; _k2 < n; _k2++) {
        total += matrix[_k2][_j2] * coefficients[_k2];
      }

      coefficients[_j2] = (matrix[n][_j2] - total) / matrix[_j2][_j2];
    }

    return coefficients;
  }

  function power () {
    var x = function x(d) {
      return d[0];
    },
        y = function y(d) {
      return d[1];
    },
        domain;

    function power(data) {
      var n = 0,
          X = 0,
          Y = 0,
          XY = 0,
          X2 = 0,
          YS = 0,
          xmin = domain ? +domain[0] : Infinity,
          xmax = domain ? +domain[1] : -Infinity;
      visitPoints(data, x, y, function (dx, dy) {
        var lx = Math.log(dx),
            ly = Math.log(dy);
        ++n;
        X += (lx - X) / n;
        Y += (ly - Y) / n;
        XY += (lx * ly - XY) / n;
        X2 += (lx * lx - X2) / n;
        YS += (dy - YS) / n;

        if (!domain) {
          if (dx < xmin) xmin = dx;
          if (dx > xmax) xmax = dx;
        }
      });

      var _ols = ols(X, Y, XY, X2),
          _ols2 = _slicedToArray(_ols, 2),
          a = _ols2[0],
          b = _ols2[1];

      a = Math.exp(a);

      var fn = function fn(x) {
        return a * Math.pow(x, b);
      },
          out = interpose(xmin, xmax, fn);

      out.a = a;
      out.b = b;
      out.predict = fn;
      out.rSquared = determination(data, x, y, YS, fn);
      return out;
    }

    power.domain = function (arr) {
      return arguments.length ? (domain = arr, power) : domain;
    };

    power.x = function (fn) {
      return arguments.length ? (x = fn, power) : x;
    };

    power.y = function (fn) {
      return arguments.length ? (y = fn, power) : y;
    };

    return power;
  }

  exports.regressionExp = exponential;
  exports.regressionLinear = linear;
  exports.regressionLoess = loess;
  exports.regressionLog = logarithmic;
  exports.regressionPoly = polynomial;
  exports.regressionPow = power;
  exports.regressionQuad = quad;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
