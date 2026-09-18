// Viewport screenshots at a series of scroll positions: node scripts/tour.mjs <url> <width> <prefix>
import puppeteer from "puppeteer-core";
import sharp from "sharp";
const [url, width = "1440", prefix = ".qa/tour"] = process.argv.slice(2);
const w = Number(width), h = w < 768 ? 860 : 900;
const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--hide-scrollbars"] });
const p = await b.newPage();
await p.setViewport({ width: w, height: h, isMobile: w < 768, hasTouch: w < 768 });
await p.goto(url, { waitUntil: "networkidle0", timeout: 90000 });
await new Promise(r => setTimeout(r, 2600));
const total = await p.evaluate(() => document.documentElement.scrollHeight);
const stops = [];
for (let y = 0; y < total; y += Math.round(h * 0.9)) stops.push(y);
const frames = [];
for (const y of stops) {
  await p.evaluate((y) => window.scrollTo(0, y), y);
  await new Promise(r => setTimeout(r, 700));
  frames.push(await p.screenshot({ type: "png" }));
}
await b.close();
// stitch frames into contact sheets of 4 (scaled)
const scale = w < 768 ? 0.5 : 0.45;
const fw = Math.round(w * scale), fh = Math.round(h * scale);
const per = w < 768 ? 6 : 4;
for (let i = 0; i < frames.length; i += per) {
  const chunk = frames.slice(i, i + per);
  const tiles = await Promise.all(chunk.map(f => sharp(f).resize(fw, fh).png().toBuffer()));
  const cols = w < 768 ? 3 : 2, rows = Math.ceil(chunk.length / cols);
  await sharp({ create: { width: fw * cols + (cols - 1) * 8, height: fh * rows + (rows - 1) * 8, channels: 3, background: "#333" } })
    .composite(tiles.map((input, j) => ({ input, left: (j % cols) * (fw + 8), top: Math.floor(j / cols) * (fh + 8) })))
    .png().toFile(`${prefix}-${i / per}.png`);
}
console.log("frames", frames.length, "sheets", Math.ceil(frames.length / per));
