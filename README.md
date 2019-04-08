# d3-regression
Calculate statistical regressions from two-dimensional data.

[<img alt="Stastical Regressions" src="https://raw.githubusercontent.com/harrystevens/d3-regression/master/img/cover.png" width="882">](https://observablehq.com/@harrystevens/introducing-d3-regression)

## Installing
If you use NPM, `npm install d3-regression`. Otherwise, download the [latest release](https://github.com/HarryStevens/d3-regression/raw/master/dist/d3-regression.zip). AMD, CommonJS, and vanilla environments are supported. In vanilla, a d3 global is exported:

```html
<script src="https://unpkg.com/d3-regression@1.0.0/dist/d3-regression.min.js"></script>
<script>

const regression = d3.regressionLinear()
  .x(d => d.x)
  .y(d => d.y)
  .domain([0, 100]);

</script>
```

## API Reference
- [Linear](#regressionLinear)
- [Exponential](#regressionExp)
- [Logarithmic](#regressionLog)
- [Quadratic](#regressionQuad)
- [Power law](#regressionPow)
- [LOESS](#regressionLoess)

<a name="regressionLinear" href="#regressionLinear">#</a> d3.<b>regressionLinear</b>() [<>](https://github.com/harrystevens/d3-regression/blob/master/src/linear.js "Source")

Creates a new linear regression generator with default [<em>x</em>-](#linear_x) and [<em>y</em>-](#linear_y) accessors and a null [domain](#linear_domain).

[<img alt="Linear regression" src="https://raw.githubusercontent.com/harrystevens/d3-regression/master/img/linear.png" width="250">](https://observablehq.com/@harrystevens/linear-regression)

<a name="_linear" href="#_linear">#</a> <i>linear</i>(<i>data</i>) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/linear.js#L6 "Source")

Computes the linear regression, which takes the form <em>y</em> = <em>ax</em> + <em>b</em>, for the specified *data* points.

Returns a line represented as an array of two points, where each point is an array of two numbers representing the point's coordinates. 

Also returns properties <em>a</em> and <em>b</em>, representing the equation's coefficients, and <em>rSquared</em>, representing the coefficient of determination. Lastly, returns a <em>predict</em> property, which is a function that outputs a <em>y</em>-coordinate given an input <em>x</em>-coordinate.

<a name="linear_x" href="#linear_x">#</a> <i>linear</i>.<b>x</b>([<i>x</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/linear.js#L67 "Source")

If <em>x</em> is specified, sets the <em>x</em>-coordinate accessor. If <em>x</em> is not specified, returns the current <em>x</em>-coordinate accessor, which defaults to:

```js
function x(d) {
  return d[0];
}
```

<a name="linear_y" href="#linear_y">#</a> <i>linear</i>.<b>y</b>([<i>y</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/linear.js#L71 "Source")

If <em>y</em> is specified, sets the <em>y</em>-coordinate accessor. If <em>y</em> is not specified, returns the current <em>y</em>-coordinate accessor, which defaults to:

```js
function y(d) {
  return d[1];
}
```

<a name="linear_domain" href="#linear_domain">#</a> <i>linear</i>.<b>domain</b>([<i>domain</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/linear.js#L63 "Source")

If <em>domain</em> is specified, sets the minimum and maximum <em>x</em>-coordinates of the returned line to the specified array of numbers. The array must contain two elements. If the elements in the given array are not numbers, they will be coerced to numbers. If <em>domain</em> is not specified, returns a copy of the regression generator’s current domain.

If data is passed to the regression generator before a <em>domain</em> has been specified, the domain will be set to the minimum and maximum <em>x</em>-coordinate values of the data.

<a name="regressionExp" href="#regressionExp">#</a> d3.<b>regressionExp</b>() [<>](https://github.com/harrystevens/d3-regression/blob/master/src/exponential.js "Source")

Creates a new exponential regression generator with default [<em>x</em>-](#exp_x) and [<em>y</em>-](#exp_y) accessors and a null [domain](#exp_domain).

[<img alt="Exponential regression" src="https://raw.githubusercontent.com/harrystevens/d3-regression/master/img/exponential-2.png" width="250">](https://observablehq.com/@harrystevens/exponential-regression)

<a name="_exponential" href="#_exponential">#</a> <i>exp</i>(<i>data</i>) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/exponential.js#L9 "Source")

Computes the exponential regression, which takes the form <em>y</em> = <em>ae</em><sup><em>bx</em></sup>, for the specified *data* points.

Returns a smooth line represented as an array of points, where each point is an array of two numbers representing the point's coordinates.

Also returns properties <em>a</em> and <em>b</em>, representing the equation's coefficients, and <em>rSquared</em>, representing the coefficient of determination. Lastly, returns a <em>predict</em> property, which is a function that outputs a <em>y</em>-coordinate given an input <em>x</em>-coordinate.

<a name="exp_x" href="#exp_x">#</a> <i>exp</i>.<b>x</b>([<i>x</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/exponential.js#L55 "Source")

See [<em>linear</em>.x()](#linear_x).

<a name="exp_y" href="#exp_y">#</a> <i>exp</i>.<b>y</b>([<i>y</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/exponential.js#L59 "Source")

See [<em>linear</em>.y()](#linear_y).

<a name="exp_domain" href="#exp_domain">#</a> <i>exp</i>.<b>domain</b>([<i>domain</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/exponential.js#L51 "Source")

See [<em>linear</em>.domain()](#linear_domain).

<a name="regressionLog" href="#regressionLog">#</a> d3.<b>regressionLog</b>() [<>](https://github.com/harrystevens/d3-regression/blob/master/src/logarithmic.js "Source")

Creates a new logarithmic regression generator with default [<em>x</em>-](#log_x) and [<em>y</em>-](#log_y) accessors and a null [domain](#log_domain).

[<img alt="Logarithmic regression" src="https://raw.githubusercontent.com/harrystevens/d3-regression/master/img/logarithmic.png" width="250">](https://observablehq.com/@harrystevens/logarithmic-regression)

<a name="_log" href="#_log">#</a> <i>log</i>(<i>data</i>) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/logarithmic.js#L9 "Source")

Computes the logarithmic regression, which takes the form <em>y</em> = <em>a</em> · ln(<em>x</em>) + <em>b</em>, for the specified *data* points.

Returns a smooth line represented as an array of points, where each point is an array of two numbers representing the point's coordinates.

Also returns properties <em>a</em> and <em>b</em>, representing the equation's coefficients, and <em>rSquared</em>, representing the coefficient of determination. Lastly, returns a <em>predict</em> property, which is a function that outputs a <em>y</em>-coordinate given an input <em>x</em>-coordinate.

<a name="log_x" href="#log_x">#</a> <i>log</i>.<b>x</b>([<i>x</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/logarithmic.js#L52 "Source")

See [<em>linear</em>.x()](#linear_x).

<a name="log_y" href="#log_y">#</a> <i>logarithmic</i>.<b>y</b>([<i>y</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/logarithmic.js#L56 "Source")

See [<em>linear</em>.y()](#linear_y).

<a name="log_domain" href="#log_domain">#</a> <i>log</i>.<b>domain</b>([<i>domain</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/logarithmic.js#L48 "Source")

See [<em>linear</em>.domain()](#linear_domain).

<a name="regressionQuad" href="#regressionQuad">#</a> d3.<b>regressionQuad</b>() [<>](https://github.com/harrystevens/d3-regression/blob/master/src/quadratic.js "Source")

Creates a new quadratic regression generator with default [<em>x</em>-](#quad_x) and [<em>y</em>-](#quad_y) accessors and a null [domain](#quad_domain).

[<img alt="Quadratic regression" src="https://raw.githubusercontent.com/harrystevens/d3-regression/master/img/quadratic.png" width="250">](https://observablehq.com/@harrystevens/quadratic-regression)

<a name="_quad" href="#_quad">#</a> <i>quad</i>(<i>data</i>) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/quadratic.js#L9 "Source")

Computes the quadratic regression, which takes the form <em>y</em> = <em>ax</em><sup>2</sup> + <em>bx</em> + <em>c</em>, for the specified *data* points.

Returns a smooth line represented as an array of points, where each point is an array of two numbers representing the point's coordinates.

Also returns properties <em>a</em>, <em>b</em>, and <e>c</e>, representing the equation's coefficients, and <em>rSquared</em>, representing the coefficient of determination. Lastly, returns a <em>predict</em> property, which is a function that outputs a <em>y</em>-coordinate given an input <em>x</em>-coordinate.

<a name="quad_x" href="#quad_x">#</a> <i>quad</i>.<b>x</b>([<i>x</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/quadratic.js#L66 "Source")

See [<em>linear</em>.x()](#linear_x).

<a name="quad_y" href="#quad_y">#</a> <i>quad</i>.<b>y</b>([<i>y</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/quadratic.js#L70 "Source")

See [<em>linear</em>.y()](#linear_y).

<a name="quad_domain" href="#quad_domain">#</a> <i>quad</i>.<b>domain</b>([<i>domain</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/quadratic.js#L62 "Source")

See [<em>linear</em>.domain()](#linear_domain).

<a name="regressionPow" href="#regressionPow">#</a> d3.<b>regressionPow</b>() [<>](https://github.com/harrystevens/d3-regression/blob/master/src/power.js "Source")

Creates a new power law regression generator with default [<em>x</em>-](#pow_x) and [<em>y</em>-](#pow_y) accessors and a null [domain](#pow_domain).

[<img alt="Power law regression" src="https://raw.githubusercontent.com/harrystevens/d3-regression/master/img/power.png" width="250">](https://observablehq.com/@harrystevens/power-law-regression)

<a name="_pow" href="#_pow">#</a> <i>pow</i>(<i>data</i>) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/power.js#L9 "Source")

Computes the power law regression, which takes the form <em>y</em> = <em>a</em><em>x</em><sup><em>b</em></sup>, for the specified *data* points.

Returns a smooth line represented as an array of points, where each point is an array of two numbers representing the point's coordinates.

Also returns properties <em>a</em> and <em>b</em>, representing the equation's coefficients, and <em>rSquared</em>, representing the coefficient of determination. Lastly, returns a <em>predict</em> property, which is a function that outputs a <em>y</em>-coordinate given an input <em>x</em>-coordinate.

<a name="pow_x" href="#pow_x">#</a> <i>pow</i>.<b>x</b>([<i>x</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/power.js#L54 "Source")

See [<em>linear</em>.x()](#linear_x).

<a name="pow_y" href="#pow_y">#</a> <i>pow</i>.<b>y</b>([<i>y</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/power.js#L58 "Source")

See [<em>linear</em>.y()](#linear_y).

<a name="pow_domain" href="#pow_domain">#</a> <i>pow</i>.<b>domain</b>([<i>domain</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/power.js#L50 "Source")

See [<em>linear</em>.domain()](#linear_domain).

<a name="regressionLoess" href="#regressionLoess">#</a> d3.<b>regressionLoess</b>() [<>](https://github.com/harrystevens/d3-regression/blob/master/src/loess.js "Source")

Creates a new [LOESS regression](https://en.wikipedia.org/wiki/Local_regression) generator with default [<em>x</em>-](#loess_x) and [<em>y</em>-](#loess_y) accessors and a [bandwidth](#loess_bandwidth) of .3. This implementation was adapted from [science.js](https://github.com/jasondavies/science.js).

[<img alt="LOESS regression" src="https://raw.githubusercontent.com/harrystevens/d3-regression/master/img/loess.png" width="250">](https://observablehq.com/@harrystevens/loess-regression)

<a name="_loess" href="#_loess">#</a> <i>loess</i>(<i>data</i>) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/loess.js#L14 "Source")

Computes the LOESS regression for the specified *data* points. Returns a line represented as an array of <em>n</em> points, where each point is an array of two numbers representing the point's coordinates.

<a name="loess_x" href="#loess_x">#</a> <i>loess</i>.<b>x</b>([<i>x</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/loess.js#L122 "Source")

See [<em>linear</em>.x()](#linear_x).

<a name="loess_y" href="#loess_y">#</a> <i>loess</i>.<b>y</b>([<i>y</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/loess.js#L126 "Source")

See [<em>linear</em>.y()](#linear_y).

<a name="loess_bandwidth" href="#loess_bandwidth">#</a> <i>loess</i>.<b>bandwidth</b>([<i>bandwidth</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/loess.js#L118 "Source")

If <em>bandwidth</em> is specified, sets the LOESS regression's bandwidth, or smoothing parameter, to the specific number between 0 and 1. The bandwidth represents the share of the total data points that are used to calculate each local fit. Higher bandwidths produce smoother lines, and vice versa. If <em>bandwidth</em> is not specified, returns a copy of the regression generator’s current bandwidth, which defaults to .3.