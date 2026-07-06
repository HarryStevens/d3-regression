import fs from "fs";
import {defaultYTickExtension, panels, xTickExtension} from "./config.js";
import {chartStyle, clipPath, renderPanel} from "./render-chart.js";

const layout = {
        margin: {top: 15, right: 20, bottom: 45, left: 40},
        innerWidth: 540,
        innerHeight: 530,
        xTickExtension,
        defaultYTickExtension
      },
      width = layout.margin.left + layout.innerWidth + 12,
      height = layout.margin.top + layout.innerHeight + layout.xTickExtension + 35;

await fs.promises.mkdir("img", {recursive: true});

for (const [i, panel] of panels.entries()) {
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Example of ${panel.call}" style="overflow: visible">`,
    `<rect width="100%" height="100%" fill="white"/>`,
    chartStyle,
    `<defs>${clipPath(i, layout)}</defs>`,
    renderPanel(panel, i, layout),
    `</svg>`
  ];

  await fs.promises.writeFile(`img/${panel.slug}.svg`, svg.join("\n") + "\n");
}
