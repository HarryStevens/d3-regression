// https://github.com/HarryStevens/d3-regression#readme Version 0.0.4. Copyright 2019 Harry Stevens.
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

  exports.regressionLinear = linear;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
