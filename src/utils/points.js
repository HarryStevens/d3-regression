// Adapted from vega-statistics by Jeffrey Heer
// License: https://github.com/vega/vega/blob/f058b099decad9db78301405dd0d2e9d8ba3d51a/LICENSE
// Source: https://github.com/vega/vega/blob/f058b099decad9db78301405dd0d2e9d8ba3d51a/packages/vega-statistics/src/regression/points.js
export function visitPoints(data, x, y, cb){
  let iterations = 0;

  for (let i = 0, n = data.length; i < n; i++) {
    const d = data[i],
          dx = x(d),
          dy = y(d);
    
    if (dx != null && isFinite(dx) && dy != null && isFinite(dy)) {
      cb(dx, dy, iterations++);
    }
  }
}