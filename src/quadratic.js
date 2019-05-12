import {determination} from "./utils/determination";
import {interpose} from "./utils/interpose";

export default function(){
  let x = d => d[0],
      y = d => d[1],
      domain;
  
  function quadratic(data){
    let n = data.length,
        valid = 0,
        xSum = 0,
        ySum = 0,
        x2Sum = 0,
        x3Sum = 0,
        x4Sum = 0,
        xySum = 0,
        x2ySum = 0,
        minX = domain ? +domain[0] : Infinity,
        maxX = domain ? +domain[1] : -Infinity;

    for (let i = 0; i < n; i++){
      const d = data[i],
          dx = x(d, i, data),
          dy = y(d, i, data),
          x2Val = Math.pow(dx, 2);
      
      // Filter out points with invalid x or y values
      if (dx != null && isFinite(dx) && dy != null && isFinite(dy)) {
        valid++;
        xSum += dx;
        ySum += dy;
        x2Sum += x2Val;
        x3Sum += Math.pow(dx, 3);
        x4Sum += Math.pow(dx, 4);
        xySum += dx * dy;
        x2ySum += x2Val * dy;
        
        if (!domain){
          if (dx < minX) minX = dx;
          if (dx > maxX) maxX = dx;
        }
      }
    }

    // Update n in case there were invalid x or y values
    n = valid;

    const sumXX = x2Sum - (Math.pow(xSum, 2) / n),
        sumXY = xySum - (xSum * ySum / n),
        sumXX2 = x3Sum - (x2Sum * xSum / n),
        sumX2Y = x2ySum - (x2Sum * ySum / n),
        sumX2X2 = x4Sum - (Math.pow(x2Sum, 2) / n),
        a = (sumX2Y * sumXX - sumXY * sumXX2) / (sumXX * sumX2X2 - Math.pow(sumXX2, 2)),
        b = (sumXY * sumX2X2 - sumX2Y * sumXX2) / (sumXX * sumX2X2 - Math.pow(sumXX2, 2)),
        c = (ySum / n) - (b * (xSum / n)) - (a * (x2Sum / n)),
        fn = x => a * Math.pow(x, 2) + b * x + c,
        out = interpose(minX, maxX, fn);

    out.a = a;
    out.b = b;
    out.c = c;
    out.predict = fn;
    out.rSquared = determination(data, x, y, ySum, fn);

    return out;
  }
  
  quadratic.domain = function(arr){
    return arguments.length ? (domain = arr, quadratic) : domain;
  }

  quadratic.x = function(fn){
    return arguments.length ? (x = fn, quadratic) : x;
  }

  quadratic.y = function(fn){
    return arguments.length ? (y = fn, quadratic) : y;
  }
  
  return quadratic;
}