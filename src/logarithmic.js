import {determination} from "./utils/determination";
import {interpose} from "./utils/interpose";
import {sort} from "./utils/sort";

export default function() {
  let x = d => d[0],
      y = d => d[1],
      domain;
  
  function logarithmic(data){
    sort(data, x);
    const n = data.length;
    
    let xlogSum = 0,
        yxlogSum = 0,
        ySum = 0,
        xlog2Sum = 0,
        minX = domain ? +domain[0] : Infinity,
        maxX = domain ? +domain[1] : -Infinity;
    
    for (let i = 0; i < n; i++) {
      const d = data[i],
          dx = x(d),
          dy = y(d);

      xlogSum += Math.log(dx);
      yxlogSum += dy * Math.log(dx);
      ySum += dy;
      xlog2Sum += Math.pow(Math.log(dx), 2);
      
      if (!domain){
        if (dx < minX) minX = dx;
        if (dx > maxX) maxX = dx;
      }
    }

    const a = ((n * yxlogSum) - (ySum * xlogSum)) / ((n * xlog2Sum) - (xlogSum * xlogSum)),
        b = (ySum - (a * xlogSum)) / n,
        fn = x => a * Math.log(x) + b,
        out = interpose(minX, maxX, fn);
        
    out.a = a;
    out.b = b;
    out.predict = fn;
    out.rSquared = determination(data, x, y, ySum, fn);

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