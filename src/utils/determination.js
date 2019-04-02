// Given a dataset, x- and y-accessors, the sum of the y values, and a predict function,
// return the coefficient of determination, or R squared.
export function determination(data, x, y, ySum, predict){
  const n = data.length;
  
  let SSE = 0,
      SST = 0;
  
  for (let i = 0; i < n; i++){
    const d = data[i],
        dx = x(d),
        dy = y(d),
        yComp = predict(dx);

    SSE += Math.pow(dy - yComp, 2);
    SST += Math.pow(dy - ySum / n, 2);
  }

  return 1 - SSE / SST;
}