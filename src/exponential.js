import {determination} from "./utils/determination";
import {interpose} from "./utils/interpose";

export default function() {
  let x = d => d[0],
      y = d => d[1],
      domain;
   
  function exponential(data){
    const n = data.length;
    
    let ySum = 0,
        x2ySum = 0,
        ylogySum = 0,
        xylogySum = 0,
        xySum = 0,
        minX = domain ? +domain[0] : Infinity,
        maxX = domain ? +domain[1] : -Infinity;

    for (let i = 0; i < n; i++) {
      const d = data[i],
          dx = x(d, i, data),
          dy = y(d, i, data);
      
      // filter out points with invalid x or y values
      if (dx != null && isFinite(dx) && dy != null && isFinite(dy)) {
        ySum += dy;
        x2ySum += dx * dx * dy;
        ylogySum += dy * Math.log(dy)
        xylogySum += dx * dy * Math.log(dy);
        xySum += dx * dy;

        if (!domain){
          if (dx < minX) minX = dx;
          if (dx > maxX) maxX = dx;
        }
      }
    }
    
    const denominator = ySum * x2ySum - xySum * xySum,
        a = Math.exp((x2ySum * ylogySum - xySum * xylogySum) / denominator),
        b = (ySum * xylogySum - xySum * ylogySum) / denominator,
        fn = x => a * Math.exp(b * x),
        out = interpose(minX, maxX, fn);
    
    out.a = a;
    out.b = b;
    out.predict = fn;
    out.rSquared = determination(data, x, y, ySum, fn);
    
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