# d3-regression
Calculate statistical regressions for two-dimensional data.

## Installing
If you use NPM, `npm install d3-regression`. Otherwise, download the [latest release](https://github.com/HarryStevens/d3-regression/raw/master/dist/d3-regression.zip). AMD, CommonJS, and vanilla environments are supported. In vanilla, a d3 global is exported:

```html
<script src="https://unpkg.com/d3-regression@0.0.4/dist/d3-regression.min.js"></script>
<script>

const regression = d3.regressionLinear()
  .x(d => d.x)
  .y(d => d.y);

</script>
```

## API Reference
<a name="regressionLinear" href="#regressionLinear">#</a> d3.<b>regressionLinear</b>() [<>](https://github.com/harrystevens/d3-regression/blob/master/src/linear.js "Source")

Creates a new linear regression generator with default [<em>x</em>-](#linear_x) and [<em>y</em>-](#linear_y) accessors and a null [domain](#linear_extent).

<a name="_linear" href="#_linear">#</a> <i>linear</i>(<i>data</i>) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/linear.js#L6 "Source")

Computes the linear regression for the specified *data* points. Returns a line represented as an array of two points, where each point is an array of two numbers representing the point's coordinates. Also returns the slope, accessible as the returned object's <em>slope</em> property, and the y-intercept, accesible as the returned object's <em>intercept</em> property.

<a name="linear_x" href="#linear_x">#</a> <i>linear</i>.<b>x</b>([<i>x</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/linear.js#L49 "Source")

If <em>x</em> is specified, sets the <em>x</em>-coordinate accessor. If <em>x</em> is not specified, returns the current <em>x</em>-coordinate accessor, which defaults to:

```js
function x(d) {
  return d[0];
}
```

<a name="linear_y" href="#linear_y">#</a> <i>linear</i>.<b>y</b>([<i>y</i>]) [<>](https://github.com/harrystevens/d3-regression/blob/master/src/linear.js#L53 "Source")

If <em>y</em> is specified, sets the <em>y</em>-coordinate accessor. If <em>y</em> is not specified, returns the current <em>y</em>-coordinate accessor, which defaults to:

```js
function y(d) {
  return d[1];
}
```

<a name="linear_domain" href="#linear_domain">#</a> <i>linear</i>.<b>domain</b>([<i>domain</i>]) [<>](hhttps://github.com/harrystevens/d3-regression/blob/master/src/linear.js#L45 "Source")

If <em>domain</em> is specified, sets the minimum and maximum x-coordinates of the returned line to the specified array of numbers. The array must contain two or more elements. If the elements in the given array are not numbers, they will be coerced to numbers. If <em>domain</em> is not specified, returns a copy of the regression generators’s current domain.