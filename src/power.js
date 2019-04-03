import {determination} from "./utils/determination";
import {interpose} from "./utils/interpose";

export default function() {
  let x = d => d[0],
    y = d => d[1],
    domain;
  
  function power(data){
    const n = data.length;
    
    let xlogSum = 0,
        xlogylogSum = 0,
        ylogSum = 0,
        xlog2Sum = 0,
        ySum = 0,
        minX = domain ? +domain[0] : Infinity,
        maxX = domain ? +domain[1] : -Infinity;

    for (let i = 0; i < n; i++) {
      const d = data[i],
          dx = x(d),
          dy = y(d);
      
      xlogSum += Math.log(dx);
      xlogylogSum += Math.log(dy) * Math.log(dx);
      ylogSum += Math.log(dy);
      xlog2Sum += Math.pow(Math.log(dx), 2);
      ySum += dy;

      if (!domain){
        if (dx < minX) minX = dx;
        if (dx > maxX) maxX = dx;
      }
    }

    const b = ((n * xlogylogSum) - (xlogSum * ylogSum)) / ((n * xlog2Sum) - Math.pow(xlogSum, 2)),
        a = Math.exp((ylogSum - (b * xlogSum)) / n),
        fn = x => a * Math.pow(x, b),
        out = interpose(minX, maxX, fn);

    out.a = a;
    out.b = b;
    out.predict = fn;
    out.rSquared = determination(data, x, y, ySum, fn);

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