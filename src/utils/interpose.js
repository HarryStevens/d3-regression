import { angle, midpoint } from "./geometry.js";

class Node {
  constructor(point, next = null){
    this.point = point;
    this.next = next;
  }
}

// Given a start point, an end point, and a prediciton function,
// returns a smooth line.
export function interpose(xmin, xmax, predict){
  const l = Math.log(xmax - xmin) * Math.LOG10E + 1 | 0;
  const precision = 1 * Math.pow(10, -l / 2 - 1), maxIter = 1e4;
  const start = new Node(px(xmin), new Node(px(xmax)));
  let iter = 0;

  while (find() && iter < maxIter);

  const points = [];
  let current = start;
  while (current){
    points.push(current.point);
    current = current.next;
  }
  return points;
  
  function px(x){
    return [x, predict(x)];
  }

  function find(){
    iter++;
    let found = false;
    let current = start;
    
    while (current && current.next){
      const p0 = current.point,
          p1 = current.next.point,
          m = midpoint([p0, p1]),
          mp = px(m[0]),
          a0 = angle([p0, m]),
          a1 = angle([p0, mp]),
          a = Math.abs(a0 - a1);
      
      if (a > precision){
        current.next = new Node(mp, current.next);
        found = true;
      }
      current = current.next;
    }
    
    return found;
  }
}
