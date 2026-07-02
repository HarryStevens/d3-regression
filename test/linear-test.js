import assert from "assert";
import * as d3 from "../src/index.js";

function shuffle(arr){
  var m = arr.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}


it("linear.domain(domain) sets the domain explicitly", () => {
  const r = d3.regressionLinear().domain([0, 50]);
  assert.deepStrictEqual(r.domain(), [0, 50]);
});

it("linear(data) calculates the slope, y-intercept, and R^2, and returns a line representing the regression", () => {
  const data = [[0, 2], [1, 1], [2, 0]];
  const r = d3.regressionLinear()
    .x(d => d[0])
    .y(d => d[1])(shuffle(data));
  
  assert.deepStrictEqual(r[0].map(d => Math.round(d)), [0, 2]);
  assert.deepStrictEqual(r[1].map(d => Math.round(d) || 0), [2, 0]);
  assert.strictEqual(Math.round(r.a), -1);
  assert.strictEqual(Math.round(r.b), 2);
  assert.strictEqual(r.rSquared, 1);
});