const tape = require("tape"),
      d3 = require("../");

tape("quadratic.domain(domain) sets the domain explicitly", function(test) {
  const r = d3.regressionQuadratic().domain([0, 50]);
  test.deepEqual(r.domain(), [0, 50]);
  test.end();
});

tape("quadartic(data) calculates the the a, b, and c coefficients, R^2, and returns a line representing the regression", function(test) {
  const data = [{x: -3, y: 7.5}, {x: -2, y: 3}, {x: -1, y: 0.5}, {x: 0, y: 1}, {x: 1, y: 3}, {x: 2, y: 6}, {x: 3, y: 14}]
  const r = d3.regressionQuadratic()
    .x(d => d.x)
    .y(d => d.y)
    .domain([-4, 4])
    (data);
  
  test.equal(r.a.toFixed(3), "1.107");
  test.equal(r.b, 1);
  test.equal(r.c.toFixed(3), "0.571");
  test.equal(r.rSquared.toFixed(3), "0.988");

  test.deepEqual(r[0], [-4, 14.285714285714286]);
  test.deepEqual(r[1], [-3, 7.5357142857142865]);
  test.deepEqual(r[2], [-2, 3]);
  test.deepEqual(r[3], [-1, 0.6785714285714284]);
  test.deepEqual(r[4], [0, 0.5714285714285712]);
  test.deepEqual(r[5], [1, 2.6785714285714284]);
  test.deepEqual(r[6], [2, 7]);
  test.deepEqual(r[7], [3, 13.535714285714286]);
  test.deepEqual(r[8], [4, 22.285714285714285]);

  test.end();
});