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

function logistic(L, k, x0, x){
  return L / (1 + Math.exp(-k * (x - x0)));
}

function data(L, k, x0){
  const out = [];
  for (let x = -6; x <= 8; x += .5) {
    out.push({x, y: logistic(L, k, x0, x)});
  }
  return out;
}

it("logistic.domain(domain) sets the domain explicitly", () => {
  const r = d3.regressionLogistic().domain([0, 50]);
  assert.deepStrictEqual(r.domain(), [0, 50]);
});

it("logistic(data) calculates L, k, x0, R^2, and returns a line representing an increasing logistic regression", () => {
  const r = d3.regressionLogistic()
    .x(d => d.x)
    .y(d => d.y)
    .domain([-6, 8])(shuffle(data(100, 1.25, 1.5)));
  
  assert.strictEqual(r.L.toFixed(6), "100.000000");
  assert.strictEqual(r.k.toFixed(6), "1.250000");
  assert.strictEqual(r.x0.toFixed(6), "1.500000");
  assert.strictEqual(r.rSquared.toFixed(6), "1.000000");
  assert.strictEqual(r.predict(1.5).toFixed(6), "50.000000");
  assert.deepStrictEqual(r[0].map(d => d.toFixed(6)), [-6, logistic(100, 1.25, 1.5, -6)].map(d => d.toFixed(6)));
  assert.deepStrictEqual(r[r.length - 1].map(d => d.toFixed(6)), [8, logistic(100, 1.25, 1.5, 8)].map(d => d.toFixed(6)));
});

it("logistic(data) calculates L, k, x0, and R^2 for a decreasing logistic regression", () => {
  const r = d3.regressionLogistic()
    .x(d => d.x)
    .y(d => d.y)(shuffle(data(80, -.8, 2)));
  
  assert.strictEqual(r.L.toFixed(6), "80.000000");
  assert.strictEqual(r.k.toFixed(6), "-0.800000");
  assert.strictEqual(r.x0.toFixed(6), "2.000000");
  assert.strictEqual(r.rSquared.toFixed(6), "1.000000");
  assert.strictEqual(r.predict(2).toFixed(6), "40.000000");
});

it("logistic(data) fits a noisy logistic trend", () => {
  const noisy = data(100, 1.25, 1.5).map(d => ({
    x: d.x,
    y: d.y * (1 + .03 * Math.sin(d.x * 2.1))
  }));
  const r = d3.regressionLogistic()
    .x(d => d.x)
    .y(d => d.y)(shuffle(noisy));
  
  assert.ok(Math.abs(r.L - 102.453207) < 1e-6);
  assert.ok(Math.abs(r.k - 1.226651) < 1e-6);
  assert.ok(Math.abs(r.x0 - 1.576985) < 1e-6);
  assert.ok(r.rSquared > .998);
});

it("logistic(data) ignores invalid and nonpositive y values", () => {
  const dirty = data(100, 1.25, 1.5).concat([
    {x: NaN, y: 50},
    {x: 99, y: NaN},
    {x: 100, y: Infinity},
    {x: 101, y: 0},
    {x: 102, y: -1}
  ]);
  const r = d3.regressionLogistic()
    .x(d => d.x)
    .y(d => d.y)(shuffle(dirty));
  
  assert.strictEqual(r.L.toFixed(6), "100.000000");
  assert.strictEqual(r.k.toFixed(6), "1.250000");
  assert.strictEqual(r.x0.toFixed(6), "1.500000");
});
