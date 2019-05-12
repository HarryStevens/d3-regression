import {determination} from "./utils/determination";
import {interpose} from "./utils/interpose";

// Adapted from regression-js by Tom Alexander
// Source: https://github.com/Tom-Alexander/regression-js/blob/master/src/regression.js#L246
// License: https://github.com/Tom-Alexander/regression-js/blob/master/LICENSE
export default function(){
  let x = d => d[0],
      y = d => d[1],
      order = 3,
      domain;
  
  function polynomial(data) {    
    // First pass through the data
    let arr = [],
        ySum = 0,
        minX = domain ? +domain[0] : Infinity,
        maxX = domain ? +domain[1] : -Infinity,
        n = data.length;
    
    for (let i = 0; i < n; i++){
      const d = data[i],
          dx = x(d, i, data),
          dy = y(d, i, data);
      
      // Filter out points with invalid x or y values
      if (dx != null && isFinite(dx) && dy != null && isFinite(dy)) {
        arr[i] = [dx, dy];
        ySum += dy;
        
        if (!domain){
          if (dx < minX) minX = dx;
          if (dx > maxX) maxX = dx;
        }
      }
    }

    // Update n in case there were invalid x or y values
    n = arr.length;

    // Calculate the coefficients
    const lhs = [],
        rhs = [],
        k = order + 1;
    
    let a = 0,
        b = 0;
    
    for (let i = 0; i < k; i++) { 
      for (let l = 0; l < n; l++) {
        a += Math.pow(arr[l][0], i) * arr[l][1];
      }

      lhs.push(a);
      a = 0;

      const c = [];
      for (let j = 0; j < k; j++) {
        for (let l = 0; l < n; l++) {
          b += Math.pow(arr[l][0], i + j);
        }
        c[j] = b;
        b = 0;
      }
      rhs.push(c);
    }
    rhs.push(lhs);

    const coefficients = gaussianElimination(rhs, k),
        fn = x => coefficients.reduce((sum, coeff, power) => sum + (coeff * Math.pow(x, power)), 0),
        out = interpose(minX, maxX, fn);
    
    out.coefficients = coefficients;
    out.predict;
    out.rSquared = determination(data, x, y, ySum, fn);
    return out;
  }

  polynomial.domain = function(arr){
    return arguments.length ? (domain = arr, polynomial) : domain;
  }

  polynomial.x = function(fn){
    return arguments.length ? (x = fn, polynomial) : x;
  }

  polynomial.y = function(fn){
    return arguments.length ? (y = fn, polynomial) : y;
  }

  polynomial.order = function(n){
    return arguments.length ? (order = n, polynomial) : order;
  }
  
  return polynomial;
}

// Given an array representing a two-dimensional matrix,
// and an order parameter representing how many degrees to solve for,
// determine the solution of a system of linear equations A * x = b using
// Gaussian elimination.
function gaussianElimination(matrix, order) {
  const n = matrix.length - 1,
      coefficients = [order];

  for (let i = 0; i < n; i++) {
    let maxrow = i;
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(matrix[i][j]) > Math.abs(matrix[i][maxrow])) {
        maxrow = j;
      }
    }

    for (let k = i; k < n + 1; k++) {
      const tmp = matrix[k][i];
      matrix[k][i] = matrix[k][maxrow];
      matrix[k][maxrow] = tmp;
    }

    for (let j = i + 1; j < n; j++) {
      for (let k = n; k >= i; k--) {
        matrix[k][j] -= (matrix[k][i] * matrix[i][j]) / matrix[i][i];
      }
    }
  }

  for (let j = n - 1; j >= 0; j--) {
    let total = 0;
    for (let k = j + 1; k < n; k++) {
      total += matrix[k][j] * coefficients[k];
    }

    coefficients[j] = (matrix[n][j] - total) / matrix[j][j];
  }

  return coefficients;
}