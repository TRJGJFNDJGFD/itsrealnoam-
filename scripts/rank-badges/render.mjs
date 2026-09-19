// Rasterizes the generated SVG badges (public/ranks/svg/*.svg) into
// high-resolution transparent PNGs (public/ranks/png/*.png) using a
// headless Chromium. Run `node generate.mjs` first if the SVGs changed.
import { readFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const svgDir = new URL("../../public/ranks/svg/", import.meta.url).pathname;
const pngDir = new URL("../../public/ranks/png/", import.meta.url).pathname;
mkdirSync(pngDir, { recursive: true });

const files = readdirSync(svgDir).filter((f) => f.endsWith(".svg"));

// Reuse a system-installed Chromium (e.g. the one this sandbox ships at
// /opt/pw-browsers/chromium) when present, so this script doesn't require
// `npx playwright install` in every environment.
const preinstalled = "/opt/pw-browsers/chromium";
const browser = await chromium.launch(existsSync(preinstalled) ? { executablePath: preinstalled } : {});
const page = await browser.newPage({ viewport: { width: 900, height: 400 }, deviceScaleFactor: 3 });

for (const f of files) {
  const svg = readFileSync(path.join(svgDir, f), "utf8");
  const html = `<!doctype html><html><head><style>html,body{margin:0;padding:0;background:transparent;}</style></head><body>${svg}</body></html>`;
  await page.setContent(html);
  await page.waitForTimeout(150);
  const name = f.replace(".svg", ".png");
  const el = await page.$("svg");
  await el.screenshot({ path: path.join(pngDir, name), omitBackground: true });
  console.log("rendered", name);
}

await browser.close();
