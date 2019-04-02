import {sort} from "./utils/sort";

export default function() {
  let x = d => d[0],
    y = d => d[1],
    domain;
  
  function power(data){
    sort(data, x);
    const n = data.length;
    
    let xlogSum = 0,
        xlogylogSum = 0,
        ylogSum = 0,
        xlog2Sum = 0,
        ySum = 0;

    for (let i = 0; i < n; i++) {
      const d = data[i],
          dx = x(d),
          dy = y(d);
      
      xlogSum += Math.log(dx);
      xlogylogSum += Math.log(dy) * Math.log(dx);
      ylogSum += Math.log(dy);
      xlog2Sum += Math.pow(Math.log(dx), 2);
      ySum += dy;
    }

    const b = ((n * xlogylogSum) - (xlogSum * ylogSum)) / ((n * xlog2Sum) - Math.pow(xlogSum, 2)),
        a = Math.exp((ylogSum - (b * xlogSum)) / n),
        fn = x => a * Math.pow(x, b);

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
      
      if (dx0 < x(data[0])) out.unshift([dx0, fn(dx0)]);
      if (dx1 > x(data[data.length - 1])) out.push([dx1, fn(dx1)]);
    }
        
    out.a = a;
    out.b = b;
    out.rSquared = rSquared;
    out.predict = fn;

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