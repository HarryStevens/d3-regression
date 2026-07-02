import { determination } from "./utils/determination.js";
import { interpose } from "./utils/interpose.js";
import { ols } from "./utils/ols.js";
import { pointX, pointY, visitPoints } from "./utils/points.js";

export default function() {
  let x = d => d[0],
      y = d => d[1],
      domain;

  function exponential(data){
    let n = 0,
        Y = 0,
        YL = 0,
        XY = 0,
        XYL = 0,
        X2Y = 0,
        xmin = domain ? +domain[0] : Infinity,
        xmax = domain ? +domain[1] : -Infinity;

    const points = [];

    visitPoints(data, x, y, (dx, dy) => {
      if (dy > 0) {
        const ly = Math.log(dy), xy = dx * dy;
        points.push([dx, dy]);
        ++n;
        Y += (dy - Y) / n;
        XY += (xy - XY) / n;
        X2Y += (dx * xy - X2Y) / n;
        YL += (dy * ly - YL) / n;
        XYL += (xy * ly - XYL) / n;

        if (!domain){
          if (dx < xmin) xmin = dx;
          if (dx > xmax) xmax = dx;
        }
      }
    });

    let [a, b] = ols(XY / Y, YL / Y, XYL / Y, X2Y / Y);
    a = Math.exp(a);
    const fn = x => a * Math.exp(b * x),
          out = interpose(xmin, xmax, fn);

    out.a = a;
    out.b = b;
    out.predict = fn;
    out.rSquared = determination(points, pointX, pointY, Y, fn);

    return out;
  }

  exponential.domain = function(arr){
    return arguments.length ? (domain = arr, exponential) : domain;
  }

  exponential.x = function(fn){
    return arguments.length ? (x = fn, exponential) : x;
  }

  exponential.y = function(fn){
    return arguments.length ? (y = fn, exponential) : y;
  }

  return exponential;
}
