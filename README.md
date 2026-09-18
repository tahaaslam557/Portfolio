# Taha Aslam — Portfolio

An editorial, motion-led portfolio built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Motion for React**.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Before you deploy — fill these in

| What | Where |
| --- | --- |
| Production URL (canonical, OG, sitemap) | `src/data/site.ts` → `site.url` |
| Contact email | `src/data/site.ts` → `site.email` |
| Upwork / LinkedIn / GitHub links (hidden while empty) | `src/data/site.ts` → `socials` |
| Project copy, stack, order, layout variant | `src/data/projects.ts` |

Nothing in the data files is invented: platforms were verified against each live site's markup, and every number on the page is computed from `projects.ts`.

## Project screenshots

Real captures live in `public/projects/<slug>/` (`hero.webp` desktop, `01.webp` mobile, `02.webp` desktop below the fold). Regenerate them any time with the locally installed Chrome:

```bash
npm run capture              # all projects
npm run capture -- simla     # one slug
```

If a file is missing, the UI shows a clearly-labelled placeholder instead of a fake screenshot.

## QA

```bash
npm run qa -- http://localhost:3000
```

Loads the home page and a project page at 320 → 1920px, records console/page errors, failed requests, horizontal overflow and heading structure, and writes full-page screenshots to `.qa/`. `node scripts/tour.mjs <url> <width> <prefix>` produces viewport-by-viewport contact sheets.

## Structure

```
src/
  app/              layout, home, /work/[slug], sitemap, robots, OG image
  components/       navigation · intro · hero · work · capabilities · stack ·
                    about · process · proof · contact · footer · ui
  data/             projects.ts (content) · site.ts (config, capabilities, stack, process)
  lib/              media.ts (build-time image resolution) · motion.ts (tokens) · hooks.ts
scripts/            capture.mjs · qa.mjs · tour.mjs
```

Design tokens (colour, type scale, spacing, motion) are defined once in `src/app/globals.css`.

## Accessibility & motion

- Custom cursor, magnetic buttons, parallax and the intro only run for fine pointers without `prefers-reduced-motion`.
- Reduced motion swaps scroll-linked sequences for static layouts and stops the marquee.
- Keyboard: visible focus rings, skip link, Escape closes the mobile menu, focus moves into it on open.
