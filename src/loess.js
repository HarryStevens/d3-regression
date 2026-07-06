// Adapted from science.js by Jason Davies
// License: https://github.com/jasondavies/science.js/blob/master/LICENSE
// Source: https://github.com/jasondavies/science.js/blob/master/src/stats/loess.js
// Adapted from vega-statistics by Jeffrey Heer
// License: https://github.com/vega/vega/blob/f058b099decad9db78301405dd0d2e9d8ba3d51a/LICENSE
// Source: https://github.com/vega/vega/blob/f21cb8792b4e0cbe2b1a3fd44b0f5db370dbaadb/packages/vega-statistics/src/regression/loess.js
import { median } from "./utils/median.js";
import { ols } from "./utils/ols.js";
import { points } from "./utils/points.js";

const maxiters = 2, epsilon = 1e-12;

export default function() {
  let x = d => d[0],
      y = d => d[1],
      bandwidth = .3;

  function loess(data) {
    const [xv, yv, ux, uy] = points(data, x, y, true),
          n = xv.length,
          bw = Math.max(2, ~~(bandwidth * n)), // # nearest neighbors
          yhat = new Float64Array(n),
          residuals = new Float64Array(n),
          robustWeights = new Float64Array(n).fill(1);

    for (let iter = -1; ++iter <= maxiters; ) {
      const interval = [0, bw - 1];

      for (let i = 0; i < n; ++i) {
        const dx = xv[i],
              i0 = interval[0],
              i1 = interval[1],
              edge = (dx - xv[i0]) > (xv[i1] - dx) ? i0 : i1;

        let W = 0, X = 0, Y = 0, XY = 0, X2 = 0,
            denom = 1 / Math.abs(xv[edge] - dx || 1); // Avoid singularity

        for (let k = i0; k <= i1; ++k) {
          const xk = xv[k],
                yk = yv[k],
                w = tricube(Math.abs(dx - xk) * denom) * robustWeights[k],
                xkw = xk * w;

          W += w;
          X += xkw;
          Y += yk * w;
          XY += yk * xkw;
          X2 += xk * xkw;
        }

        // Linear regression fit
        const [a, b] = ols(X / W, Y / W, XY / W, X2 / W);
        yhat[i] = a + b * dx;
        residuals[i] = Math.abs(yv[i] - yhat[i]);

        updateInterval(xv, i + 1, interval);
      }

      if (iter === maxiters) {
        break;
      }

      const medianResidual = median(residuals);
      if (Math.abs(medianResidual) < epsilon) break;

      for (let i = 0, arg, w; i < n; ++i){
        arg = residuals[i] / (6 * medianResidual);
        // Default to epsilon (rather than zero) for large deviations
        // Keeping weights tiny but non-zero prevents singularites
        robustWeights[i] = (arg >= 1) ? epsilon : ((w = 1 - arg * arg) * w);
      }
    }

    const out = output(xv, yhat, ux, uy);
    out.predict = predict(out);
    out.rSquared = determination(yv, yhat);
    return out;
  }

  loess.bandwidth = function(bw) {
    return arguments.length ? (bandwidth = bw, loess) : bandwidth;
  };

  loess.x = function(fn) {
    return arguments.length ? (x = fn, loess) : x;
  };

  loess.y = function(fn) {
    return arguments.length ? (y = fn, loess) : y;
  };

  return loess;
}

// Weighting kernel for local regression
function tricube(x) {
  return (x = 1 - x * x * x) * x * x;
}

// Advance sliding window interval of nearest neighbors
function updateInterval(xv, i, interval) {
  let val = xv[i],
      left = interval[0],
      right = interval[1] + 1;

  if (right >= xv.length) return;

  // Step right if distance to new right edge is <= distance to old left edge
  // Step when distance is equal to ensure movement over duplicate x values
  while (i > left && (xv[right] - val) <= (val - xv[left])) {
    interval[0] = ++left;
    interval[1] = right;
    ++right;
  }
}

// Generate smoothed output points
// Average points with repeated x values
function output(xv, yhat, ux, uy) {
  const n = xv.length, out = [];
  let i = 0, cnt = 0, prev = [], v;

  for (; i<n; ++i) {
    v = xv[i] + ux;
    if (prev[0] === v) {
      // Average output values via online update
      prev[1] += (yhat[i] - prev[1]) / (++cnt);
    } else {
      // Add new output point
      cnt = 0;
      prev[1] += uy;
      prev = [v, yhat[i]];
      out.push(prev);
    }
  }
  prev[1] += uy;

  return out;
}

function determination(yv, yhat) {
  let SSE = 0,
      SST = 0;

  for (let i = 0, n = yv.length; i < n; ++i) {
    const sse = yv[i] - yhat[i];
    SSE += sse * sse;
    SST += yv[i] * yv[i];
  }

  return 1 - SSE / SST;
}

function predict(points) {
  return x => {
    const n = points.length;
    if (!n) return NaN;
    if (n === 1) return points[0][1];

    let i = 0;
    while (i < n && points[i][0] < x) ++i;

    if (i === 0) return interpolate(points[0], points[1], x);
    if (i === n) return interpolate(points[n - 2], points[n - 1], x);
    if (points[i][0] === x) return points[i][1];
    return interpolate(points[i - 1], points[i], x);
  };
}

function interpolate(a, b, x) {
  const dx = b[0] - a[0];
  return dx ? a[1] + (b[1] - a[1]) * (x - a[0]) / dx : a[1];
}
