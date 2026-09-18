/**
 * Visual + runtime QA against a running dev/prod server.
 *
 *   npm run qa                    # defaults to http://localhost:3000
 *   npm run qa -- http://localhost:3210
 *
 * For each viewport it loads the home page and one project page, records
 * console errors, page errors, failed requests and horizontal overflow, and
 * writes full-page screenshots to .qa/<width>-<page>.png.
 */
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const base = process.argv[2] ?? "http://localhost:3000";
const out = path.join(process.cwd(), ".qa");
mkdirSync(out, { recursive: true });

const CANDIDATES = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].filter(Boolean);
const executablePath = CANDIDATES.find((p) => existsSync(p));

const WIDTHS = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920];
const PAGES = [
  { name: "home", path: "/" },
  { name: "project", path: "/work/dreamy-destinations" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--hide-scrollbars"] });
let problems = 0;

for (const width of WIDTHS) {
  for (const pg of PAGES) {
    const page = await browser.newPage();
    const issues = [];
    page.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning") issues.push(`${m.type()}: ${m.text().slice(0, 200)}`);
    });
    page.on("pageerror", (e) => issues.push(`pageerror: ${e.message.slice(0, 200)}`));
    page.on("requestfailed", (r) => issues.push(`requestfailed: ${r.url().slice(0, 120)}`));
    page.on("response", (r) => {
      if (r.status() >= 400) issues.push(`http ${r.status()}: ${r.url().slice(0, 120)}`);
    });

    await page.setViewport({ width, height: 900, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 });
    await page.goto(base + pg.path, { waitUntil: "networkidle0", timeout: 90_000 });
    await sleep(2200); // intro

    // Scroll through so in-view animations resolve, then measure.
    await page.evaluate(async () => {
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y < h; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    });
    await sleep(600);
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      h1: document.querySelectorAll("h1").length,
      imgsMissingAlt: [...document.images].filter((i) => !i.hasAttribute("alt")).length,
    }));
    if (metrics.overflow > 0) issues.push(`horizontal overflow: +${metrics.overflow}px`);
    if (metrics.h1 !== 1) issues.push(`h1 count: ${metrics.h1}`);
    if (metrics.imgsMissingAlt) issues.push(`images without alt: ${metrics.imgsMissingAlt}`);

    await page.screenshot({ path: path.join(out, `${width}-${pg.name}.png`), fullPage: true });
    await page.close();

    const uniq = [...new Set(issues)];
    problems += uniq.length;
    console.log(`${String(width).padStart(4)} ${pg.name.padEnd(8)} ${uniq.length ? "✗" : "✓"}`);
    uniq.forEach((i) => console.log(`       - ${i}`));
  }
}

await browser.close();
console.log(problems ? `\n${problems} issue(s) found. Screenshots in .qa/` : "\nNo issues. Screenshots in .qa/");
