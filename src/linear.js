import {determination} from "./utils/determination";

export default function(){
  let x = d => d[0],
      y = d => d[1],
      domain;

  function linear(data){
    let n = data.length,
        valid = 0,
        xSum = 0,
        ySum = 0,
        xySum = 0,
        x2Sum = 0,
        minX = domain ? +domain[0] : Infinity,
        maxX = domain ? +domain[1] : -Infinity;

    for (let i = 0; i < n; i++){
      const d = data[i],
          dx = x(d, i, data),
          dy = y(d, i, data);
      
      // Filter out points with invalid x or y values
      if (dx != null && isFinite(dx) && dy != null && isFinite(dy)) {
        valid++;
        xSum += dx;
        ySum += dy;
        xySum += dx * dy;
        x2Sum += dx * dx;

        if (!domain){
          if (dx < minX) minX = dx;
          if (dx > maxX) maxX = dx;
        }
      }
    }

    // Update n in case there were invalid x or y values
    n = valid;

    const a = n * xySum,
        b = xSum * ySum,
        c = n * x2Sum,
        d = xSum * xSum,
        slope = (a - b) / (c - d),
        e = ySum,
        f = slope * xSum,
        intercept = (e - f) / n,
        fn = x => slope * x + intercept;

    const rSquared = determination(data, x, y, ySum, fn);

    const out = [[minX, minX * slope + intercept], [maxX, maxX * slope + intercept]];
    out.a = slope;
    out.b = intercept;
    out.predict = fn;
    out.rSquared = rSquared;

    return out;
  }

  linear.domain = function(arr){
    return arguments.length ? (domain = arr, linear) : domain;
  }

  linear.x = function(fn){
    return arguments.length ? (x = fn, linear) : x;
  }

  linear.y = function(fn){
    return arguments.length ? (y = fn, linear) : y;
  }

  return linear;
}
