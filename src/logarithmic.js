import { determination } from "./utils/determination";
import { interpose } from "./utils/interpose";
import { visitPoints } from "./utils/points";

export default function() {
  let x = d => d[0],
      y = d => d[1],
      domain;
  
  function logarithmic(data){
    let n = 0,
        XL = 0,
        XLY = 0,
        Y = 0,
        XL2 = 0,
        minX = domain ? +domain[0] : Infinity,
        maxX = domain ? +domain[1] : -Infinity;
    
    visitPoints(data, x, y, (dx, dy) => {
      ++n;
      XL += Math.log(dx);
      XLY += dy * Math.log(dx);
      Y += dy;
      XL2 += Math.pow(Math.log(dx), 2);
      
      if (!domain){
        if (dx < minX) minX = dx;
        if (dx > maxX) maxX = dx;
      }
    });
    
    const a = (n * XLY - Y * XL) / (n * XL2 - XL * XL),
        b = (Y - a * XL) / n,
        fn = x => a * Math.log(x) + b,
        out = interpose(minX, maxX, fn);
        
    out.a = a;
    out.b = b;
    out.predict = fn;
    out.rSquared = determination(data, x, y, Y, fn);

    return out; 
  }
  
  logarithmic.domain = function(arr){
    return arguments.length ? (domain = arr, logarithmic) : domain;
  }

  logarithmic.x = function(fn){
    return arguments.length ? (x = fn, logarithmic) : x;
  }

  logarithmic.y = function(fn){
    return arguments.length ? (y = fn, logarithmic) : y;
  }
  
  return logarithmic;
}