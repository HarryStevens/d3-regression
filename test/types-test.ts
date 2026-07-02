import {
  regressionExp,
  regressionLinear,
  regressionLoess,
  regressionLog,
  regressionPoly,
  regressionPow,
  regressionQuad
} from "../src/index.js";

type Datum = {x: number; y: number};

const data: Datum[] = [
  {x: 0, y: 1},
  {x: 1, y: 3},
  {x: 2, y: 5}
];

const linear = regressionLinear<Datum>()
  .x(d => d.x)
  .y(d => d.y)
  .domain([0, 2]);

linear.x()(data[0], 0, data).toFixed();
linear.y()(data[0], 0, data).toFixed();
linear.domain()?.map(d => d.toFixed());

const linearResult = linear(data);
linearResult[0][0].toFixed();
linearResult.a.toFixed();
linearResult.b.toFixed();
linearResult.rSquared.toFixed();
linearResult.predict(3).toFixed();

const expResult = regressionExp<Datum>().x(d => d.x).y(d => d.y)(data);
expResult.a.toFixed();
expResult.b.toFixed();
expResult.predict(3).toFixed();

const log = regressionLog<Datum>().x(d => d.x).y(d => d.y).base(10);
log.base().toFixed();
const logResult = log(data);
logResult.a.toFixed();
logResult.b.toFixed();

const poly = regressionPoly<Datum>().x(d => d.x).y(d => d.y).order(3);
poly.order().toFixed();
const polyResult = poly(data);
polyResult.coefficients.map(d => d.toFixed());
polyResult.predict(3).toFixed();

const powResult = regressionPow<Datum>().x(d => d.x).y(d => d.y)(data);
powResult.a.toFixed();
powResult.b.toFixed();

const quadResult = regressionQuad<Datum>().x(d => d.x).y(d => d.y)(data);
quadResult.a.toFixed();
quadResult.b.toFixed();
quadResult.c.toFixed();

const loess = regressionLoess<Datum>().x(d => d.x).y(d => d.y).bandwidth(0.5);
loess.bandwidth().toFixed();
const loessResult = loess(data);
loessResult[0][0].toFixed();
