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
        xlog2Sum = 0;
    
    for (let i = 0; i < n; i++) {
      const d = data[i],
          dx = x(d),
          dy = y(d);

      xlogSum += Math.log(dx);
      yxlogSum += dy * Math.log(dx);
      ySum += dy;
      xlog2Sum += Math.pow(Math.log(dx), 2);
    }

    const a = ((n * yxlogSum) - (ySum * xlogSum)) / ((n * xlog2Sum) - (xlogSum * xlogSum)),
        b = (ySum - (a * xlogSum)) / n,
        fn = x => a * Math.log(x) + b;
    
    // Calculate R squared and populate output array
    let out = [],
        SSE = 0,
        SST = 0;
    for (let i = 0; i < n; i++){
      const d = data[i],
          dx = x(d),
          dy = y(d),
          yComp = fn(dx);
     
      SSE += Math.pow(dy - yComp, 2);
      SST += Math.pow(dy - ySum / n, 2);
      out[i] = [dx, yComp];
    }

    const rSquared = 1 - SSE / SST;
    
    if (domain){
      const dx0 = domain[0],
          dx1 = domain[1];
      
      if (dx0 !== x(data[0])) out.unshift([dx0, fn(dx0)]);
      if (dx1 !== x(data[data.length - 1])) out.push([dx1, fn(dx1)]);
    }
        
    out.a = a;
    out.b = b;
    out.rSquared = rSquared;
    out.predict = fn;
    
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