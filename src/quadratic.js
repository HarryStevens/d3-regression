import {x as pointX, y as pointY} from "./point";

export default function(){
  let x = pointX,
      y = pointY,
      domain;
  
  function quadratic(data){
    const n = data.length;
    
    let xSum = 0,
        ySum = 0,
        x2Sum = 0,
        x3Sum = 0,
        x4Sum = 0,
        xySum = 0,
        x2ySum = 0,
        xValues = [];
    
    for (let i = 0; i < n; i++){
      const d = data[i],
            xVal = x(d),
            yVal = y(d),
            x2Val = Math.pow(xVal, 2);
      
      xSum += xVal;
      ySum += yVal;
      x2Sum += x2Val;
      x3Sum += Math.pow(xVal, 3);
      x4Sum += Math.pow(xVal, 4);
      xySum += xVal * yVal;
      x2ySum += x2Val * yVal;
      
      xValues.push(xVal);
    }

    const sumXX = x2Sum - ((Math.pow(xSum, 2)) / n),
          sumXY = xySum - ((xSum * ySum) / n),
          sumXX2 = x3Sum - ((x2Sum * xSum) / n),
          sumX2Y = x2ySum - ((x2Sum * ySum) / n),
          sumX2X2 = x4Sum - ((Math.pow(x2Sum, 2)) / n),
          a = ((sumX2Y * sumXX) - (sumXY * sumXX2)) / ((sumXX * sumX2X2) - (Math.pow(sumXX2, 2))),
          b = ((sumXY * sumX2X2) - (sumX2Y * sumXX2)) / ((sumXX * sumX2X2) - (Math.pow(sumXX2, 2))),
          c = (ySum / n) - (b * (xSum / n)) - (a * (x2Sum / n)),
          fn = x => (a * (Math.pow(x, 2))) + (b * x) + c,
          rSquared = 1 - (Math.pow((ySum - (a * x2Sum) - (b * xSum) - c), 2) / Math.pow(ySum - (ySum / n), 2));
    
    if (domain){
      xValues.unshift(domain[0]);
      xValues.push(domain[1]);
    }
    
    let out = [];
    for (let i = 0, l = xValues.length; i < l; i++){
      const d = xValues[i];
      out.push([d, fn(d)]);
    }
    
    out.a = a;
    out.b = b;
    out.c = c;
    out.rSquared = rSquared;
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