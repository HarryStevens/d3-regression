import { determination } from "./utils/determination";
import { interpose } from "./utils/interpose";
import { visitPoints } from "./utils/points";

export default function() {
  let x = d => d[0],
      y = d => d[1],
      domain;
  
  function power(data){
    let n = 0,
        XL = 0,
        XLYL = 0,
        YL = 0,
        XL2 = 0,
        Y = 0,
        minX = domain ? +domain[0] : Infinity,
        maxX = domain ? +domain[1] : -Infinity;
    
    visitPoints(data, x, y, (dx, dy) => {
      n++;
      XL += Math.log(dx);
      XLYL += Math.log(dy) * Math.log(dx);
      YL += Math.log(dy);
      XL2 += Math.pow(Math.log(dx), 2);
      Y += dy;

      if (!domain){
        if (dx < minX) minX = dx;
        if (dx > maxX) maxX = dx;
      }
    });

    const b = (n * XLYL - XL * YL) / (n * XL2 - Math.pow(XL, 2)),
        a = Math.exp((YL - b * XL) / n),
        fn = x => a * Math.pow(x, b),
        out = interpose(minX, maxX, fn);

    out.a = a;
    out.b = b;
    out.predict = fn;
    out.rSquared = determination(data, x, y, Y, fn);

    return out; 
  }
  
  power.domain = function(arr){
    return arguments.length ? (domain = arr, power) : domain;
  }

  power.x = function(fn){
    return arguments.length ? (x = fn, power) : x;
  }

  power.y = function(fn){
    return arguments.length ? (y = fn, power) : y;
  }
  
  return power;
}