import { determination } from "./utils/determination";
import { interpose } from "./utils/interpose";
import { visitPoints } from "./utils/points";

export default function() {
  let x = d => d[0],
      y = d => d[1],
      domain;
   
  function exponential(data){
    let n = 0,
        Y = 0,
        X2Y = 0,
        YLY = 0,
        XYLY = 0,
        XY = 0,
        minX = domain ? +domain[0] : Infinity,
        maxX = domain ? +domain[1] : -Infinity;

    visitPoints(data, x, y, (dx, dy) => {
      n++;
      Y += dy;
      X2Y += dx * dx * dy;
      YLY += dy * Math.log(dy)
      XYLY += dx * dy * Math.log(dy);
      XY += dx * dy;

      if (!domain){
        if (dx < minX) minX = dx;
        if (dx > maxX) maxX = dx;
      }
    });
    
    const denominator = Y * X2Y - XY * XY,
        a = Math.exp((X2Y * YLY - XY * XYLY) / denominator),
        b = (Y * XYLY - XY * YLY) / denominator,
        fn = x => a * Math.exp(b * x),
        out = interpose(minX, maxX, fn);
    
    out.a = a;
    out.b = b;
    out.predict = fn;
    out.rSquared = determination(data, x, y, Y, fn);
    
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