import assert from "assert";
import * as d3 from "../src/index.js";

const data = [
  [1, 3], [2, 5], [3, 9], [4, 15],
  [5, 25], [6, 38], [7, 55], [8, 75]
];

const regressions = [
  d3.regressionLinear,
  d3.regressionExp,
  d3.regressionLog,
  d3.regressionLogistic,
  d3.regressionPoly,
  d3.regressionPow,
  d3.regressionQuad,
  d3.regressionSigmoidal,
  d3.regressionLoess
];

it("regressions accept Maps and Sets", () => {
  regressions.forEach(regression => {
    const array = regression()(data),
          map = regression()(new Map(data)),
          set = regression()(new Set(data));

    assertResultsEqual(map, array);
    assertResultsEqual(set, array);
  });
});

function assertResultsEqual(actual, expected) {
  assert.strictEqual(actual.length, expected.length);

  for (let i = 0, n = expected.length; i < n; ++i) {
    assertPointEqual(actual[i], expected[i]);
  }

  Object.keys(expected).forEach(key => {
    const value = expected[key];
    if (typeof value === "number") assert.strictEqual(actual[key].toFixed(6), value.toFixed(6));
    else if (Array.isArray(value)) assert.deepStrictEqual(actual[key].map(fixed), value.map(fixed));
  });

  if (expected.predict) assert.strictEqual(actual.predict(4.5).toFixed(6), expected.predict(4.5).toFixed(6));
}

function assertPointEqual(actual, expected) {
  assert.deepStrictEqual(actual.map(fixed), expected.map(fixed));
}

function fixed(value) {
  return value.toFixed(6);
}
