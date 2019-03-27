export default function(){
  let x = d => d[0],
      y = d => d[0],
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
    
    // Calculate sums for coefficients
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
          fn = x => (a * (Math.pow(x, 2))) + (b * x) + c;
    
    // Calculate R squared
    let out = [];
    let SSE = 0;
    let SST = 0;
    for (let i = 0; i < n; i++){
      const d = data[i],
            xVal = x(d),
            yVal = y(d),
            yComp = fn(xVal);
     
      SSE += Math.pow(yVal - yComp, 2);
      SST += Math.pow(yVal - ySum / n, 2);
      out.push([xVal, yComp]);
    }

    const rSquared = 1 - SSE / SST;
    
    if (domain){
      const dx0 = domain[0],
            dx1 = domain[1];
      
      out.unshift([dx0, fn(dx0)]);
      out.push([dx1, fn(dx1)]);
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