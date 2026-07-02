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

function sigmoidal(A, B, C, M, x){
  return C + A / (1 + Math.exp(-B * (x - M)));
}

function data(A, B, C, M){
  const out = [];
  for (let x = -6; x <= 8; x += .5) {
    out.push({x, y: sigmoidal(A, B, C, M, x)});
  }
  return out;
}

it("sigmoidal.domain(domain) sets the domain explicitly", () => {
  const r = d3.regressionSigmoidal().domain([0, 50]);
  assert.deepStrictEqual(r.domain(), [0, 50]);
});

it("sigmoidal(data) fits an increasing shifted sigmoid", () => {
  const r = d3.regressionSigmoidal()
    .x(d => d.x)
    .y(d => d.y)
    .domain([-6, 8])(shuffle(data(100, 1.25, 20, 1.5)));
  
  assert.ok(Math.abs(r.A - 100) < .001);
  assert.ok(Math.abs(r.B - 1.25) < .001);
  assert.ok(Math.abs(r.C - 20) < .001);
  assert.ok(Math.abs(r.M - 1.5) < .001);
  assert.ok(r.rSquared > .999999999);
  assert.ok(Math.abs(r.predict(1.5) - 70) < .001);
  assert.deepStrictEqual(r[0].map(d => d.toFixed(6)), [-6, r.predict(-6)].map(d => d.toFixed(6)));
  assert.deepStrictEqual(r[r.length - 1].map(d => d.toFixed(6)), [8, r.predict(8)].map(d => d.toFixed(6)));
});

it("sigmoidal(data) fits a decreasing shifted sigmoid", () => {
  const r = d3.regressionSigmoidal()
    .x(d => d.x)
    .y(d => d.y)(shuffle(data(80, -.8, 10, 2)));
  
  assert.ok(Math.abs(r.A - 80) < .001);
  assert.ok(Math.abs(r.B + .8) < .001);
  assert.ok(Math.abs(r.C - 10) < .001);
  assert.ok(Math.abs(r.M - 2) < .001);
  assert.ok(r.rSquared > .999999999);
  assert.ok(Math.abs(r.predict(2) - 50) < .001);
});

it("sigmoidal(data) fits a noisy shifted sigmoid trend", () => {
  const noisy = data(100, 1.25, 20, 1.5).map(d => ({
    x: d.x,
    y: d.y * (1 + .03 * Math.sin(d.x * 2.1))
  }));
  const r = d3.regressionSigmoidal()
    .x(d => d.x)
    .y(d => d.y)(shuffle(noisy));
  
  assert.ok(Math.abs(r.A - 100.17) < .01);
  assert.ok(Math.abs(r.B - 1.23) < .01);
  assert.ok(Math.abs(r.C - 20) < .01);
  assert.ok(Math.abs(r.M - 1.51) < .01);
  assert.ok(r.rSquared > .998);
});

it("sigmoidal(data) ignores invalid values", () => {
  const dirty = data(100, 1.25, 20, 1.5).concat([
    {x: NaN, y: 50},
    {x: 99, y: NaN},
    {x: 100, y: Infinity}
  ]);
  const r = d3.regressionSigmoidal()
    .x(d => d.x)
    .y(d => d.y)(shuffle(dirty));
  
  assert.ok(Math.abs(r.A - 100) < .001);
  assert.ok(Math.abs(r.B - 1.25) < .001);
  assert.ok(Math.abs(r.C - 20) < .001);
  assert.ok(Math.abs(r.M - 1.5) < .001);
});
