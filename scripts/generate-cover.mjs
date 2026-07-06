import fs from "fs";
import {height, panels, width} from "./config.js";
import {chartStyle, clipPath, panelTransform, renderPanelFrame} from "./render-chart.js";

const svg = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Examples of nine d3-regression functions" style="overflow: visible">`,
  `<rect width="100%" height="100%" fill="white"/>`,
  chartStyle,
  `<defs>${panels.map((_, i) => clipPath(i)).join("")}</defs>`
];

panels.forEach((panel, i) => {
  svg.push(`<g transform="${panelTransform(i)}">`);
  svg.push(renderPanelFrame(panel, i));
  svg.push(`</g>`);
});

svg.push(`</svg>`);

await fs.promises.mkdir("img", {recursive: true});
await fs.promises.writeFile("img/cover.svg", svg.join("\n") + "\n");
