import {
  defaultYTickExtension,
  formatDefault,
  innerHeight,
  innerWidth,
  margin,
  panelHeight,
  panelWidth,
  columns,
  xTickExtension
} from "./config.js";

export const defaultLayout = {
  margin,
  innerWidth,
  innerHeight,
  xTickExtension,
  defaultYTickExtension
};

export const chartStyle = `<style>
    text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #222; }
    .title { font-size: 32px; font-weight: 400; }
    .call { font-size: 32px; fill: #888; }
    .tick { font-size: 20px; fill: #333; }
    .grid { stroke: #ddd; stroke-width: 2; shape-rendering: crispEdges; }
    .zero { stroke: #666; stroke-width: 2; shape-rendering: crispEdges; }
    .dot { fill: #1f1f1f; fill-opacity: .9; stroke: #000; stroke-width: 1; }
    .line { fill: none; stroke: #000; stroke-width: 3; stroke-linejoin: round; stroke-linecap: round; }
  </style>`;

export function renderPanel(panel, i, layout = defaultLayout) {
  const {margin, innerWidth, innerHeight, xTickExtension, defaultYTickExtension} = layout,
        xFormat = panel.format?.x || (typeof panel.format === "function" ? panel.format : formatDefault),
        yFormat = panel.format?.y || (typeof panel.format === "function" ? panel.format : formatDefault),
        yTickExtension = panel.yTickExtension ?? defaultYTickExtension,
        result = panel.regression(panel.data),
        x = scale(panel.xDomain, [margin.left, margin.left + innerWidth]),
        y = scale(panel.yDomain, [margin.top + innerHeight, margin.top]),
        parts = [];

  panel.xTicks.forEach(t => {
    const xx = x(t), cls = Math.abs(t) < 1e-9 ? "zero" : "grid";
    parts.push(`<line class="${cls}" x1="${f(xx)}" y1="${margin.top}" x2="${f(xx)}" y2="${margin.top + innerHeight + xTickExtension}"/>`);
    parts.push(`<text class="tick" x="${f(xx)}" y="${margin.top + innerHeight + xTickExtension + 22}" text-anchor="middle">${escape(xFormat(t))}</text>`);
  });

  panel.yTicks.forEach(t => {
    const yy = y(t), cls = Math.abs(t) < 1e-9 ? "zero" : "grid";
    parts.push(`<line class="${cls}" x1="${margin.left - yTickExtension}" y1="${f(yy)}" x2="${margin.left + innerWidth}" y2="${f(yy)}"/>`);
    parts.push(`<text class="tick" x="${margin.left - yTickExtension - 8}" y="${f(yy + 7)}" text-anchor="end">${escape(yFormat(t))}</text>`);
  });

  parts.push(`<g clip-path="url(#plot-${i})">`);
  parts.push(`<path class="line" d="${path(result, x, y)}"/>`);
  parts.push(`</g>`);

  panel.data.forEach(d => {
    parts.push(`<circle class="dot" r="${panel.radius ?? 4}" cx="${f(x(d.x))}" cy="${f(y(d.y))}"/>`);
  });
  return parts.join("\n");
}

export function renderPanelFrame(panel, i, layout = defaultLayout) {
  return [
    `<text class="title" x="0" y="29">${escape(panel.title)}</text>`,
    `<text class="call" x="${panel.callX ?? titleOffset(panel.title)}" y="29">${escape(panel.call)}</text>`,
    renderPanel(panel, i, layout)
  ].join("\n");
}

export function clipPath(id, layout = defaultLayout) {
  const {margin, innerWidth, innerHeight} = layout;
  return `<clipPath id="plot-${id}"><rect x="${margin.left}" y="${margin.top}" width="${innerWidth}" height="${innerHeight}"/></clipPath>`;
}

export function panelTransform(i) {
  const column = i % columns,
        row = Math.floor(i / columns),
        x0 = column * panelWidth,
        y0 = row * panelHeight;
  return `translate(${x0},${y0})`;
}

function scale(domain, range) {
  const d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1], m = (r1 - r0) / (d1 - d0);
  return value => r0 + (value - d0) * m;
}

function path(points, x, y) {
  return points.filter(d => Number.isFinite(d[0]) && Number.isFinite(d[1])).map((d, i) => `${i ? "L" : "M"}${f(x(d[0]))},${f(y(d[1]))}`).join("");
}

function titleOffset(title) {
  return title.length * 17 + 28;
}

function f(value) {
  return Number.isInteger(value) ? value : value.toFixed(3).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

function escape(value) {
  return `${value}`.replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;"}[c]));
}
