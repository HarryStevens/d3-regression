import {sort} from "./utils/sort";

export default function() {
  let x = d => d[0],
      y = d => d[1],
      domain;
   
  function exponential(data){
    sort(data, x);
    const n = data.length;
    
    let ySum = 0,
        x2ySum = 0,
        ylogySum = 0,
        xylogySum = 0,
        xySum = 0;

    for (let i = 0; i < data.length; i++) {
      const d = data[i],
          dx = x(d),
          dy = y(d);
      
      ySum += dy;
      x2ySum += dx * dx * dy;
      ylogySum += dy * Math.log(dy)
      xylogySum += dx * dy * Math.log(dy);
      xySum += dx * dy;
    }
    
    const denominator = ((ySum * x2ySum) - (xySum * xySum)),
        a = Math.exp(((x2ySum * ylogySum) - (xySum * xylogySum)) / denominator),
        b = ((ySum * xylogySum) - (xySum * ylogySum)) / denominator,
        fn = x => a * Math.exp(b * x);

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