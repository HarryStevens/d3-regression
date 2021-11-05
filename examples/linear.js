
// Run with node linear.js
var d3 = require('d3-regression');

data2 = [{ x: 8, y: 3 }, { x: 2, y: 10 }, { x: 11, y: 3 }, { x: 6, y: 6 }, { x: 5, y: 8 }, { x: 4, y: 12 }, { x: 12, y: 1 }, { x: 9, y: 4 }, { x: 6, y: 9 }, { x: 1, y: 14 }]

data3 = [{ x: 0, y: 1 },  { x: 1, y: 2 }, { x: 2, y: 3 }]

data =  [
      { x: 0, y: 3.3 },
      { x: 1, y: 3.5 },
      { x: 2, y: 3.8 },
      { x: 3, y: 4.1 },
      { x: 4, y: 4.4 },
      { x: 5, y: 4.7 },
      { x: 6, y: 4.9 },
      { x: 7, y: 5.2 },
      { x: 8, y: 5.4 },
      { x: 9, y: 5.6 }
    ]


linearRegression = d3.regressionLinear()
  .x(d => d.x)
  .y(d => d.y)
  .domain([-1.7, 16]);

// Select your data sourse
const regressionLine = linearRegression(data3);

console.log(regressionLine);

console.log(regressionLine.predict(1));
