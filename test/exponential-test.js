const tape = require("tape"),
      d3 = require("../");

tape("exp.domain(domain) sets the domain explicitly", function(test) {
  const r = d3.regressionExp().domain([0, 50]);
  test.deepEqual(r.domain(), [0, 50]);
  test.end();
});

tape("exp(data) calculates the the a and b coefficients, R^2, and returns a line representing the regression", function(test) {
  const data = [{x: 0, y: 3}, {x: 1, y: 7}, {x: 2, y: 10}, {x: 3, y: 24}, {x: 4, y: 50}, {x: 5, y: 95}];
  const r = d3.regressionExp()
    .x(d => d.x)
    .y(d => d.y)
    .domain([-2, 6])
    (data);
  
  test.equal(r.a.toFixed(3), "3.033");
  test.equal(r.b.toFixed(3), "0.691");
  test.equal(r.rSquared.toFixed(3), "0.998");

  test.deepEqual(r[0], [-2, 0.7617573113942354]);
  test.deepEqual(r[1], [0, 3.033107795694952]);
  test.deepEqual(r[2], [1, 6.052341881761767]);
  test.deepEqual(r[3], [2, 12.076999803871011]);
  test.deepEqual(r[4], [3, 24.098758317374507]);
  test.deepEqual(r[5], [4, 48.0872867326768]);
  test.deepEqual(r[6], [5,95.95461786275978]);
  test.deepEqual(r[7], [6,191.47033061716962]);

  test.end();
});