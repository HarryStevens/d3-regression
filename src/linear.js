import { determination } from "./utils/determination";
import { visitPoints } from "./utils/points";

export default function(){
  let x = d => d[0],
      y = d => d[1],
      domain;

  function linear(data){
    let n = 0,
        X = 0, // sum of x
        Y = 0, // sum of y
        XY = 0, // sum of x * y
        X2 = 0, // sum of x * x
        minX = domain ? +domain[0] : Infinity,
        maxX = domain ? +domain[1] : -Infinity;

    visitPoints(data, x, y, (dx, dy) => {
      ++n;
      X += dx;
      Y += dy;
      XY += dx * dy;
      X2 += dx * dx;
      if (!domain){
        if (dx < minX) minX = dx;
        if (dx > maxX) maxX = dx;
      }
    });

    const slope = (n * XY - X * Y) / (n * X2 - X * X),
        intercept = (Y - slope * X) / n,
        fn = x => slope * x + intercept,
        out = [[minX, fn(minX)], [maxX, fn(maxX)]];
    
    out.a = slope;
    out.b = intercept;
    out.predict = fn;
    out.rSquared = determination(data, x, y, Y, fn);

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
