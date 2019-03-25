// https://github.com/HarryStevens/d3-regression#readme Version 0.0.5. Copyright 2019 Harry Stevens.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.d3 = global.d3 || {}));
}(this, function (exports) { 'use strict';

  function x(d) {
    return d[0];
  }
  function y(d) {
    return d[1];
  }

  function linear () {
    var x$1 = x,
        y$1 = y,
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
        var dx = x$1(data[i]);
        var dy = y$1(data[i]);
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
          intercept = (e - f) / n;
      var out = [[minX, minX * slope + intercept], [maxX, maxX * slope + intercept]];
      out.slope = slope;
      out.intercept = intercept;
      return out;
    }

    linear.domain = function (arr) {
      return arguments.length ? (domain = arr, linear) : domain;
    };

    linear.x = function (fn) {
      return arguments.length ? (x$1 = fn, linear) : x$1;
    };

    linear.y = function (fn) {
      return arguments.length ? (y$1 = fn, linear) : y$1;
    };

    return linear;
  }

  function quadratic () {
    var x$1 = x,
        y$1 = y,
        domain;

    function quadratic(data) {
      var n = data.length;
      var xSum = 0,
          ySum = 0,
          x2Sum = 0,
          x3Sum = 0,
          x4Sum = 0,
          xySum = 0,
          x2ySum = 0,
          xValues = [];

      for (var i = 0; i < n; i++) {
        var d = data[i],
            xVal = x$1(d),
            yVal = y$1(d),
            x2Val = Math.pow(xVal, 2);
        xSum += xVal;
        ySum += yVal;
        x2Sum += x2Val;
        x3Sum += Math.pow(xVal, 3);
        x4Sum += Math.pow(xVal, 4);
        xySum += xVal * yVal;
        x2ySum += x2Val * yVal;
        xValues.push(xVal);
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
      },
          rSquared = 1 - Math.pow(ySum - a * x2Sum - b * xSum - c, 2) / Math.pow(ySum - ySum / n, 2);

      if (domain) {
        xValues.unshift(domain[0]);
        xValues.push(domain[1]);
      }

      var out = [];

      for (var _i = 0, l = xValues.length; _i < l; _i++) {
        var _d = xValues[_i];
        out.push([_d, fn(_d)]);
      }

      out.a = a;
      out.b = b;
      out.c = c;
      out.rSquared = rSquared;
      return out;
    }

    quadratic.domain = function (arr) {
      return arguments.length ? (domain = arr, quadratic) : domain;
    };

    quadratic.x = function (fn) {
      return arguments.length ? (x$1 = fn, quadratic) : x$1;
    };

    quadratic.y = function (fn) {
      return arguments.length ? (y$1 = fn, quadratic) : y$1;
    };

    return quadratic;
  }

  exports.regressionLinear = linear;
  exports.regressionQuadratic = quadratic;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
