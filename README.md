# d3-regression
Calculate statistical regressions for two-dimensional data.

d3-regression is still in development mode (v0.x). This is not a stable release, and the API is subject to breaking changes.

## Installing
If you use NPM, `npm install d3-regression`. Otherwise, download the [latest release](https://github.com/HarryStevens/d3-regression/raw/master/dist/d3-regression.zip). AMD, CommonJS, and vanilla environments are supported. In vanilla, a d3 global is exported:

```html
<script src="https://unpkg.com/d3-regression@0.0.9/dist/d3-regression.min.js"></script>
<script>

const regression = d3.regressionLinear()
  .x(d => d.x)
  .y(d => d.y);

</script>
```

## API Reference
<a name="regressionLinear" href="#regressionLinear">#</a> d3.<b>regressionLinear</b>() [<>](https://github.com/harrystevens/d3-regression/blob/master/src/linear.js "Source")

Creates a new linear regression generator with default [<em>x</em>-](#linear_x) and [<em>y</em>-](#linear_y) accessors and a null [domain](#linear_domain).

<a name="_linear" href="#_linear">#</a> <i>linear</i>(<i>data</i>) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/linear.js#L8 "Source")

Computes the linear regression for the specified *data* points. Returns a line represented as an array of two points, where each point is an array of two numbers representing the point's coordinates. Also returns the slope, accessible as the returned object's <em>slope</em> property, and the y-intercept, accesible as the returned object's <em>intercept</em> property.

<a name="linear_x" href="#linear_x">#</a> <i>linear</i>.<b>x</b>([<i>x</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/linear.js#L51 "Source")

If <em>x</em> is specified, sets the <em>x</em>-coordinate accessor. If <em>x</em> is not specified, returns the current <em>x</em>-coordinate accessor, which defaults to:

```js
function x(d) {
  return d[0];
}
```

<a name="linear_y" href="#linear_y">#</a> <i>linear</i>.<b>y</b>([<i>y</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/linear.js#L55 "Source")

If <em>y</em> is specified, sets the <em>y</em>-coordinate accessor. If <em>y</em> is not specified, returns the current <em>y</em>-coordinate accessor, which defaults to:

```js
function y(d) {
  return d[1];
}
```

<a name="linear_domain" href="#linear_domain">#</a> <i>linear</i>.<b>domain</b>([<i>domain</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/linear.js#L47 "Source")

If <em>domain</em> is specified, sets the minimum and maximum <em>x</em>-coordinates of the returned line to the specified array of numbers. The array must contain two elements. If the elements in the given array are not numbers, they will be coerced to numbers. If <em>domain</em> is not specified, returns a copy of the regression generator’s current domain.

If data is passed to the linear regression generator before a <em>domain</em> has been specified, the domain will be set to the minimum and maximum <em>x</em>-coordinate values.

<a name="regressionLoess" href="#regressionLoess">#</a> d3.<b>regressionLoess</b>() [<>](https://github.com/harrystevens/d3-regression/blob/master/src/loess.js "Source")

Creates a new [LOESS regression](https://en.wikipedia.org/wiki/Local_regression) generator with default [<em>x</em>-](#loess_x) and [<em>y</em>-](#loess_y) accessors and a [bandwidth](#loess_bandwidth) of .3. This implementation was adapted from [science.js](https://github.com/jasondavies/science.js).

<a name="_loess" href="#_loess">#</a> <i>loess</i>(<i>data</i>) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/loess.js#L14 "Source")

Computes the LOESS regression for the specified *data* points. Returns a line represented as an array of <em>n</em> points, where each point is an array of two numbers representing the point's coordinates.

<a name="loess_x" href="#loess_x">#</a> <i>loess</i>.<b>x</b>([<i>x</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/loess.js#L121 "Source")

See [<em>linear</em>.x()](#linear_x).

<a name="loess_y" href="#loess_y">#</a> <i>loess</i>.<b>y</b>([<i>y</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/loess.js#L125 "Source")

See [<em>linear</em>.y()](#linear_y).

<a name="loess_bandwidth" href="#loess_bandwidth">#</a> <i>loess</i>.<b>bandwidth</b>([<i>bandwidth</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/loess.js#L117 "Source")

If <em>bandwidth</em> is specified, sets the LOESS regression's bandwidth, or smoothing parameter, to the specific number between 0 and 1. The bandwidth represents the share of the total data points that are used to calculate each local fit. Higher bandwidths produce smoother lines, and vice versa. If <em>bandwidth</em> is not specified, returns a copy of the regression generator’s current bandwidth, which defaults to .3.

<a name="regressionQuadratic" href="#regressionQuadratic">#</a> d3.<b>regressionQuadratic</b>() [<>](https://github.com/harrystevens/d3-regression/blob/master/src/quadratic.js "Source")

Creates a new quadratic regression generator with default [<em>x</em>-](#quadratic_x) and [<em>y</em>-](#quadratic_y) accessors and a null [domain](#quadratic_domain).

<a name="_quadratic" href="#_quadratic">#</a> <i>quadratic</i>(<i>data</i>) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/quadratic.js#L8 "Source")

Computes the quadratic regression for the specified *data* points. Returns a line represented as an array of <em>n</em> points, where each point is an array of two numbers representing the point's coordinates. You can use the [cardinal spline interpolator](https://github.com/d3/d3-shape#curveCardinal) from d3-shape to chart the returned points.

Also returns the <em>a</em>, <em>b</em>, and <em>c</em> coefficients as well as the coefficient of determination, or <em>R squared</em>, accessible as the returned object's <em>a</em>, <em>b</em>, <em>c</em> and <em>rSquared</em> properties, respectively.

<a name="quadratic_x" href="#quadratic_x">#</a> <i>quadratic</i>.<b>x</b>([<i>x</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/quadratic.js#L70 "Source")

See [<em>linear</em>.x()](#linear_x).

<a name="quadratic_y" href="#quadratic_y">#</a> <i>quadratic</i>.<b>y</b>([<i>y</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/quadratic.js#L74 "Source")

See [<em>linear</em>.y()](#linear_y).

<a name="quadratic_domain" href="#quadratic_domain">#</a> <i>quadratic</i>.<b>domain</b>([<i>domain</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/quadratic.js#L66 "Source")

See [<em>linear</em>.domain()](#linear_domain).