import fs from "fs";
import {
  regressionExp,
  regressionLinear,
  regressionLoess,
  regressionLog,
  regressionLogistic,
  regressionPoly,
  regressionPow,
  regressionQuad,
  regressionSigmoidal
} from "../src/index.js";

export const margin = {top: 60, right: 86, bottom: 70, left: 40},
      padRight = 13,
      padBottom = 34,
      fullWidth = 1800,
      fullHeight = 1500,
      width = fullWidth - margin.right + padRight,
      height = fullHeight - margin.bottom + padBottom,
      columns = 3,
      rows = 3,
      panelWidth = fullWidth / columns,
      panelHeight = fullHeight / rows,
      innerWidth = panelWidth - margin.left - margin.right,
      innerHeight = panelHeight - margin.top - margin.bottom,
      chartWidth = panelWidth - margin.right + padRight,
      chartHeight = panelHeight - margin.bottom + padBottom,
      defaultYTickExtension = 0,
      xTickExtension = 10;

export const formatDefault = value => value,
      formatThousands = value => value >= 1000 ? `${value / 1000}k` : value,
      formatYear = value => value === 1900 ? "1900" : `'${String(value).slice(2)}`;

export const panels = [
  {
    title: "Linear",
    slug: "linear",
    call: "d3.regressionLinear()",
    radius: 6,
    data: [{x: 8, y: 3}, {x: 2, y: 10}, {x: 11, y: 3}, {x: 6, y: 6}, {x: 5, y: 8}, {x: 4, y: 12}, {x: 12, y: 1}, {x: 9, y: 4}, {x: 6, y: 9}, {x: 1, y: 14}],
    regression: regressionLinear().x(d => d.x).y(d => d.y).domain([-1.7, 16]),
    xDomain: [-4, 16],
    yDomain: [-4, 16],
    xTicks: [-4, -2, 0, 2, 4, 6, 8, 10, 12, 14, 16],
    yTicks: [-4, 0, 4, 8, 12, 16],
    yTickExtension: 9.5
  },
  {
    title: "Quadratic",
    slug: "quadratic",
    call: "d3.regressionQuad()",
    radius: 6,
    data: [{x: -3, y: 7.5}, {x: -2, y: 3}, {x: -1, y: .5}, {x: 0, y: 1}, {x: 1, y: 3}, {x: 2, y: 6}, {x: 3, y: 14}],
    regression: regressionQuad().x(d => d.x).y(d => d.y).domain([-4, 4]),
    xDomain: [-4, 4],
    yDomain: [-2, 14],
    xTicks: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
    yTicks: [-2, 0, 2, 4, 6, 8, 10, 12, 14],
    yTickExtension: 9.5
  },
  {
    title: "Polynomial",
    slug: "polynomial",
    call: "d3.regressionPoly()",
    radius: 6,
    data: [{x: 0, y: 140}, {x: 1, y: 149}, {x: 2, y: 159.6}, {x: 3, y: 159}, {x: 4, y: 155.9}, {x: 5, y: 169}, {x: 6, y: 162.9}, {x: 7, y: 169}, {x: 8, y: 180}],
    regression: regressionPoly().x(d => d.x).y(d => d.y).order(3).domain([0, 8]),
    xDomain: [0, 8],
    yDomain: [130, 190],
    xTicks: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    yTicks: [130, 150, 170, 190]
  },
  {
    title: "Logarithmic",
    slug: "logarithmic",
    call: "d3.regressionLog()",
    radius: 6,
    data: [{x: 1, y: 4.2}, {x: 2, y: 4.65}, {x: 3, y: 5.3}, {x: 4, y: 5.4}, {x: 5, y: 5.55}, {x: 6, y: 5.75}, {x: 7, y: 5.65}, {x: 9, y: 5.85}, {x: 10, y: 6.4}, {x: 11, y: 6.4}, {x: 12, y: 6.35}, {x: 13, y: 6.5}, {x: 14, y: 6.55}, {x: 15, y: 6.72}, {x: 16, y: 6.6}, {x: 17, y: 6.85}, {x: 18, y: 6.65}, {x: 20, y: 7}, {x: 21, y: 6.8}, {x: 22, y: 6.95}, {x: 23, y: 7.1}, {x: 24, y: 7.15}, {x: 25, y: 7.16}, {x: 26, y: 6.9}, {x: 27, y: 6.95}, {x: 28, y: 6.95}, {x: 30, y: 7.25}, {x: 31, y: 6.95}],
    regression: regressionLog().x(d => d.x).y(d => d.y).domain([.8, 35]),
    xDomain: [-1, 35],
    yDomain: [4, 8],
    xTicks: [0, 5, 10, 15, 20, 25, 30, 35],
    yTicks: [4, 5, 6, 7, 8],
    yTickExtension: 19
  },
  {
    title: "Exponential",
    slug: "exponential",
    call: "d3.regressionExp()",
    radius: 6,
    data: [{x: 0, y: 3}, {x: 1, y: 7}, {x: 2, y: 10}, {x: 3, y: 24}, {x: 4, y: 50}, {x: 5, y: 95}],
    regression: regressionExp().x(d => d.x).y(d => d.y).domain([-2, 10]),
    xDomain: [-2, 10],
    yDomain: [0, 100],
    xTicks: [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    yTicks: [0, 20, 40, 60, 80, 100]
  },
  {
    title: "Power law",
    slug: "power",
    call: "d3.regressionPow()",
    radius: 4,
    format: {x: formatThousands},
    data: [{x: 1, y: 82.74}, {x: 2, y: 40.24}, {x: 3, y: 35.82}, {x: 4, y: 33}, {x: 5, y: 31.37}, {x: 6, y: 30.26}, {x: 7, y: 30.01}, {x: 8, y: 29.02}, {x: 9, y: 28.62}, {x: 10, y: 28.31}, {x: 20, y: 20.22}, {x: 40, y: 13.04}, {x: 80, y: 8.49}, {x: 160, y: 5.9}, {x: 320, y: 3.9}, {x: 640, y: 2.4}, {x: 1280, y: 1.5}, {x: 2560, y: .8}, {x: 5000, y: .38}],
    regression: regressionPow().x(d => d.x).y(d => d.y).domain([1, 5000]),
    xDomain: [0, 5000],
    yDomain: [0, 100],
    xTicks: [0, 1000, 2000, 3000, 4000, 5000],
    yTicks: [0, 20, 40, 60, 80, 100]
  },
  {
    title: "LOESS",
    slug: "loess",
    call: "d3.regressionLoess()",
    radius: 4,
    format: {x: formatYear},
    data: loessData(),
    regression: regressionLoess().x(d => d.x).y(d => d.y).bandwidth(.3),
    xDomain: [1900, 2020],
    yDomain: [55, 62],
    xTicks: [1900, 1920, 1940, 1960, 1980, 2000, 2020],
    yTicks: [55, 56, 57, 58, 59, 60, 61, 62],
    yTickExtension: 8
  },
  {
    title: "Logistic",
    slug: "logistic",
    call: "d3.regressionLogistic()",
    radius: 6,
    data: [
      {x: -6, y: .9}, {x: -5, y: .7}, {x: -4, y: 3.8}, {x: -3, y: 5.9}, {x: -2, y: 17.4}, {x: -1, y: 28.6},
      {x: 0, y: 55.8}, {x: 1, y: 69.1}, {x: 2, y: 89.7}, {x: 3, y: 91.5}, {x: 4, y: 99.4}, {x: 5, y: 96.8}, {x: 6, y: 101.2}
    ],
    regression: regressionLogistic().x(d => d.x).y(d => d.y),
    xDomain: [-6, 6],
    yDomain: [0, 120],
    xTicks: [-6, -4, -2, 0, 2, 4, 6],
    yTicks: [0, 20, 40, 60, 80, 100, 120]
  },
  {
    title: "Sigmoidal",
    slug: "sigmoidal",
    call: "d3.regressionSigmoidal()",
    radius: 6,
    data: [
      {x: -6, y: 20.1}, {x: -5, y: 17.6}, {x: -4, y: 22.8}, {x: -3, y: 24.2}, {x: -2, y: 36.9}, {x: -1, y: 47.3},
      {x: 0, y: 74.8}, {x: 1, y: 88.2}, {x: 2, y: 109.5}, {x: 3, y: 111.1}, {x: 4, y: 120.8}, {x: 5, y: 116.9}, {x: 6, y: 121.7}
    ],
    regression: regressionSigmoidal().x(d => d.x).y(d => d.y),
    xDomain: [-6, 6],
    yDomain: [0, 140],
    xTicks: [-6, -4, -2, 0, 2, 4, 6],
    yTicks: [0, 20, 40, 60, 80, 100, 120, 140]
  }
];

function loessData() {
  return [{"x":1900,"y":57.5605},{"x":1901,"y":57.3214},{"x":1902,"y":56.2134},{"x":1903,"y":56.317},{"x":1904,"y":57.4467},{"x":1905,"y":57.1332},{"x":1906,"y":57.2392},{"x":1907,"y":56.5545},{"x":1908,"y":56.2721},{"x":1909,"y":56.2912},{"x":1910,"y":57.7532},{"x":1911,"y":55.474},{"x":1912,"y":55.5628},{"x":1913,"y":56.5263},{"x":1914,"y":57.4455},{"x":1915,"y":56.8189},{"x":1916,"y":55.5932},{"x":1917,"y":56.6997},{"x":1918,"y":56.9079},{"x":1919,"y":56.3611},{"x":1920,"y":56.1257},{"x":1921,"y":57.3778},{"x":1922,"y":56.1452},{"x":1923,"y":56.4466},{"x":1924,"y":57.1546},{"x":1925,"y":57.206},{"x":1926,"y":58.8471},{"x":1927,"y":56.94},{"x":1928,"y":57.7148},{"x":1929,"y":57.3422},{"x":1930,"y":56.9745},{"x":1931,"y":58.3638},{"x":1932,"y":56.9607},{"x":1933,"y":56.8247},{"x":1934,"y":59.7805},{"x":1935,"y":56.8945},{"x":1936,"y":58.6637},{"x":1937,"y":57.2449},{"x":1938,"y":57.3329},{"x":1939,"y":58.4247},{"x":1940,"y":58.8798},{"x":1941,"y":57.1222},{"x":1942,"y":57.1411},{"x":1943,"y":57.894},{"x":1944,"y":56.2842},{"x":1945,"y":57.1573},{"x":1946,"y":56.8022},{"x":1947,"y":57.6003},{"x":1948,"y":55.6891},{"x":1949,"y":56.2792},{"x":1950,"y":58.1899},{"x":1951,"y":57.2899},{"x":1952,"y":56.8036},{"x":1953,"y":57.2433},{"x":1954,"y":57.6142},{"x":1955,"y":56.3011},{"x":1956,"y":57.0172},{"x":1957,"y":57.1288},{"x":1958,"y":58.9603},{"x":1959,"y":59.0416},{"x":1960,"y":58.0866},{"x":1961,"y":57.8652},{"x":1962,"y":57.4384},{"x":1963,"y":57.1077},{"x":1964,"y":56.6202},{"x":1965,"y":56.774},{"x":1966,"y":58.0992},{"x":1967,"y":57.5668},{"x":1968,"y":57.5989},{"x":1969,"y":57.5899},{"x":1970,"y":57.8767},{"x":1971,"y":56.2718},{"x":1972,"y":57.2934},{"x":1973,"y":57.3641},{"x":1974,"y":57.7036},{"x":1975,"y":56.3447},{"x":1976,"y":57.5107},{"x":1977,"y":58.0088},{"x":1978,"y":57.6893},{"x":1979,"y":57.7485},{"x":1980,"y":58.1052},{"x":1981,"y":59.3551},{"x":1982,"y":56.4003},{"x":1983,"y":57.6184},{"x":1984,"y":58.2609},{"x":1985,"y":57.3929},{"x":1986,"y":58.9427},{"x":1987,"y":58.3293},{"x":1988,"y":58.7852},{"x":1989,"y":58.1885},{"x":1990,"y":58.0488},{"x":1991,"y":58.16},{"x":1992,"y":59.2918},{"x":1993,"y":57.7408},{"x":1994,"y":58.1055},{"x":1995,"y":58.9677},{"x":1996,"y":59.594},{"x":1997,"y":59.1923},{"x":1998,"y":56.7942},{"x":1999,"y":58.0356},{"x":2000,"y":58.8363},{"x":2001,"y":59.2216},{"x":2002,"y":58.8964},{"x":2003,"y":59.529},{"x":2004,"y":58.9128},{"x":2005,"y":58.6833},{"x":2006,"y":58.6975},{"x":2007,"y":58.9929},{"x":2008,"y":58.9459},{"x":2009,"y":58.917},{"x":2010,"y":57.7926},{"x":2011,"y":57.5186},{"x":2012,"y":59.5448},{"x":2013,"y":59.3921},{"x":2014,"y":61.5208},{"x":2015,"y":60.7992},{"x":2016,"y":60.1429},{"x":2017,"y":60.4208}];
}

