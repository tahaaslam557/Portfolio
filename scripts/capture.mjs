/**
 * Captures real screenshots of every project with the locally installed
 * Chrome (via puppeteer-core — no browser download) and writes optimised
 * WebP files into public/projects/<slug>/.
 *
 *   npm run capture            # all projects
 *   npm run capture -- simla   # one slug
 *
 * Output per project:
 *   hero.webp  — desktop viewport, 1440×900
 *   01.webp    — mobile viewport, 430×932
 *   02.webp    — desktop, scrolled one viewport down (below-the-fold content)
 *
 * Set CHROME_PATH to point at a different Chrome/Edge binary.
 */
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const root = process.cwd();

const CANDIDATES = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const executablePath = CANDIDATES.find((p) => existsSync(p));
if (!executablePath) {
  console.error("No Chrome/Edge found. Set CHROME_PATH.");
  process.exit(1);
}

// Read slug/url pairs straight out of the TS data file — no build step needed.
const source = readFileSync(path.join(root, "src/data/projects.ts"), "utf8");
const slugs = [...source.matchAll(/^\s+slug: "([^"]+)",/gm)].map((m) => m[1]);
const urls = [...source.matchAll(/^\s+url: "([^"]+)",/gm)].map((m) => m[1]);
const projects = slugs.map((slug, i) => ({ slug, url: urls[i] }));

const only = process.argv[2];
const list = only ? projects.filter((p) => p.slug === only) : projects;

const DESKTOP_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1, userAgent: DESKTOP_UA };
const MOBILE = {
  width: 430,
  height: 932,
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Some sites use a preloader that waits for `window.load`, which never fires
 * when a third-party resource hangs. Hide full-viewport overlays whose
 * id/class says "loader"/"preload" so the actual page is visible.
 */
async function dismissPreloaders(page) {
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("body *")) {
      const name = `${el.id} ${el.className}`;
      if (!/loader|preload/i.test(String(name))) continue;
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed" && cs.position !== "absolute") continue;
      const r = el.getBoundingClientRect();
      if (r.width >= innerWidth * 0.9 && r.height >= innerHeight * 0.9) el.style.setProperty("display", "none", "important");
    }
    document.documentElement.style.overflow = "";
    if (document.body) document.body.style.overflow = "";
  });
}

/** Scroll through the page so lazy-loaded media and reveal animations fire, then return to top. */
async function warmUp(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    const max = Math.min(document.body?.scrollHeight ?? 0, 6000);
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await sleep(600);
}

/**
 * Some hosts answer with a bot-check page that then reloads the real site.
 * Wait until the *final* document is complete and no navigation has happened
 * for a while, so we never screenshot a challenge page or a half-loaded one.
 */
async function settle(page, maxMs = 30_000) {
  let lastNav = Date.now();
  page.on("framenavigated", (f) => {
    if (f === page.mainFrame()) lastNav = Date.now();
  });
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    const state = await page.evaluate(() => document.readyState).catch(() => "loading");
    if (state === "complete" && Date.now() - lastNav > 2500) return;
    await sleep(300);
  }
}

async function open(browser, url, viewport) {
  const page = await browser.newPage();
  if (viewport.userAgent) await page.setUserAgent(viewport.userAgent);
  await page.setViewport(viewport);
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60_000 }).catch(() => {});
  await settle(page);
  // Give preloaders / entrance animations time to fade out.
  await sleep(2000);
  await dismissPreloaders(page);
  await warmUp(page);
  await dismissPreloaders(page);
  return page;
}

async function save(buffer, out) {
  await sharp(buffer).webp({ quality: 82, effort: 5 }).toFile(out);
}

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--hide-scrollbars", "--disable-gpu", "--no-first-run", "--no-default-browser-check"],
});

try {
  for (const p of list) {
    const dir = path.join(root, "public", "projects", p.slug);
    mkdirSync(dir, { recursive: true });
    process.stdout.write(`${p.slug} … `);
    try {
      const desktop = await open(browser, p.url, DESKTOP);
      await save(await desktop.screenshot({ type: "png" }), path.join(dir, "hero.webp"));
      await desktop.evaluate(() => window.scrollTo(0, window.innerHeight));
      await sleep(900);
      await save(await desktop.screenshot({ type: "png" }), path.join(dir, "02.webp"));
      await desktop.close();

      const mobile = await open(browser, p.url, MOBILE);
      await save(await mobile.screenshot({ type: "png" }), path.join(dir, "01.webp"));
      await mobile.close();
      console.log("ok");
    } catch (err) {
      console.log(`failed (${String(err.message).split("\n")[0]})`);
    }
  }
} finally {
  await browser.close();
}
console.log("Done.");
