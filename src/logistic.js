import { determination } from "./utils/determination.js";
import { interpose } from "./utils/interpose.js";
import { ols } from "./utils/ols.js";
import { pointX, pointY, visitPoints } from "./utils/points.js";
import { sigmoid } from "./utils/sigmoid.js";

const tolerance = 1e-12;

function predict(L, k, x0, x){
  return L * sigmoid(k * (x - x0));
}

export default function() {
  let x = d => d[0],
      y = d => d[1],
      domain;

  function logistic(data){
    let n = 0,
        Y = 0,
        ymax = -Infinity,
        xmin = domain ? +domain[0] : Infinity,
        xmax = domain ? +domain[1] : -Infinity;

    const points = [];

    visitPoints(data, x, y, (dx, dy) => {
      if (dy > 0) {
        points.push([dx, dy]);
        ++n;
        Y += (dy - Y) / n;
        if (dy > ymax) ymax = dy;

        if (!domain){
          if (dx < xmin) xmin = dx;
          if (dx > xmax) xmax = dx;
        }
      }
    });

    const lo = Math.log(ymax * (1 + tolerance)),
          hi = Math.log(Math.max(ymax * 100, ymax + 100));

    let best = fit(lo),
        bestIndex = 0,
        steps = 64;

    for (let i = 1; i <= steps; ++i) {
      const f = fit(lo + (hi - lo) * i / steps);
      if (f.sse < best.sse) {
        best = f;
        bestIndex = i;
      }
    }

    const phi = (1 + Math.sqrt(5)) / 2;

    let left = lo + (hi - lo) * Math.max(0, bestIndex - 1) / steps,
        right = lo + (hi - lo) * Math.min(steps, bestIndex + 1) / steps,
        c = right - (right - left) / phi,
        d = left + (right - left) / phi,
        fc = fit(c),
        fd = fit(d);

    for (let i = 0; i < 64; ++i) {
      if (fc.sse < fd.sse) {
        right = d;
        d = c;
        fd = fc;
        c = right - (right - left) / phi;
        fc = fit(c);
      } else {
        left = c;
        c = d;
        fc = fd;
        d = left + (right - left) / phi;
        fd = fit(d);
      }
    }

    if (fc.sse < best.sse) best = fc;
    if (fd.sse < best.sse) best = fd;

    const {L, k, x0} = best,
          fn = x => predict(L, k, x0, x),
          out = interpose(xmin, xmax, fn);

    out.L = L;
    out.k = k;
    out.x0 = x0;
    out.predict = fn;
    out.rSquared = determination(points, pointX, pointY, Y, fn);

    return out;

    function fit(logL){
      const L = Math.exp(logL);

      let X = 0,
          Z = 0,
          XZ = 0,
          X2 = 0,
          m = 0;

      for (let i = 0; i < n; ++i) {
        const [dx, dy] = points[i],
              dz = Math.log(L / dy - 1);
        if (isFinite(dz)) {
          ++m;
          X += (dx - X) / m;
          Z += (dz - Z) / m;
          XZ += (dx * dz - XZ) / m;
          X2 += (dx * dx - X2) / m;
        }
      }

      const [intercept, slope] = ols(X, Z, XZ, X2),
            k = -slope,
            x0 = intercept / k;

      let sse = 0;
      for (let i = 0; i < n; ++i) {
        const [dx, dy] = points[i],
              e = dy - predict(L, k, x0, dx);
        sse += e * e;
      }

      return {L, k, x0, sse};
    }
  }

  logistic.domain = function(arr){
    return arguments.length ? (domain = arr, logistic) : domain;
  }

  logistic.x = function(fn){
    return arguments.length ? (x = fn, logistic) : x;
  }

  logistic.y = function(fn){
    return arguments.length ? (y = fn, logistic) : y;
  }

  return logistic;
}
