import {angle, midpoint} from "./geometry";

// Given a start point, an end point, and a prediciton function,
// returns a smooth line.
export function interpose(minX, maxX, predict){
  const precision = .01, maxIter = 1e4;
  let points = [px(minX), px(maxX)], iter = 0;

  while (find(points) && iter < maxIter);

  return points;
  
  function px(x){
    return [x, predict(x)];
  }

  function find(points){
    iter++;
    const n = points.length;
    let found = false;
    
    for (let i = 0; i < n - 1; i++){
      const p0 = points[i],
          p1 = points[i + 1],
          m = midpoint([p0, p1]),
          mp = px(m[0]),
          a0 = angle([p0, m]),
          a1 = angle([p0, mp]),
          a = Math.abs(a0 - a1);
      
      if (a > precision){
        points.splice(i + 1, 0, mp);
        found = true;
      }
    }
    
    return found;
  }
}