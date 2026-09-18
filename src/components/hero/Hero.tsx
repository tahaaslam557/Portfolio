"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useCallback, type PointerEvent } from "react";
import { site } from "@/data/site";
import { projectStats } from "@/data/projects";
import type { ProjectFragment } from "@/lib/media";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import { useIntro } from "@/components/intro/IntroProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HeroVisual } from "./HeroVisual";

const LINES = [
  { text: "I build", outline: false, accent: false, indent: "0" },
  { text: "Digital", outline: false, accent: true, indent: "0.08em" },
  { text: "Experiences", outline: false, accent: false, indent: "0" },
];

export function Hero({ fragments }: { fragments: ProjectFragment[] }) {
  const { ready } = useIntro();
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const interactive = fine && !reduced;

  // Normalised pointer position (-0.5 … 0.5) drives spotlight, text drift and the visual.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useMotionValue(50);
  const py = useMotionValue(40);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const spx = useSpring(px, { stiffness: 80, damping: 25 });
  const spy = useSpring(py, { stiffness: 80, damping: 25 });

  const spotlight = useMotionTemplate`radial-gradient(38rem circle at ${spx}% ${spy}%, rgba(255,107,61,0.18), transparent 70%)`;
  const drift1 = useTransform(smx, [-0.5, 0.5], [-8, 8]);
  const drift2 = useTransform(smx, [-0.5, 0.5], [12, -12]);
  const drift3 = useTransform(smx, [-0.5, 0.5], [-5, 5]);
  const drifts = [drift1, drift2, drift3];

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (!interactive) return;
      const r = e.currentTarget.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      mx.set(nx - 0.5);
      my.set(ny - 0.5);
      px.set(nx * 100);
      py.set(ny * 100);
    },
    [interactive, mx, my, px, py],
  );

  // Entrance choreography waits for the intro to finish (or runs at once if skipped).
  const base = 0.1;
  const show = ready;
  const enter = (i: number) =>
    reduced
      ? {}
      : {
          initial: { y: "110%", rotate: 1.5 },
          animate: show ? { y: "0%", rotate: 0 } : {},
          transition: {
            duration: 1,
            ease: ease.outExpo,
            delay: base + i * 0.1,
          },
        };
  const fade = (d: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: show ? { opacity: 1, y: 0 } : {},
          transition: { duration: 0.7, ease: ease.outQuart, delay: base + d },
        };

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pb-10 pt-32 sm:pb-14 lg:pt-40"
      onPointerMove={onPointerMove}
    >
      <div aria-hidden="true" className="ambient absolute inset-0 -z-10" />
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
      {interactive && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: spotlight }}
        />
      )}

      <div className="container-x">
        {/* Top metadata row */}
        <motion.div
          className="label-mono mb-10 flex items-center justify-between text-fg-3 sm:mb-14"
          {...fade(0)}
        >
          <span>{site.role}</span>
          <span className="hidden sm:inline">{site.location}</span>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Headline — sized from its own column so the longest line always fits */}
          <div className="@container lg:col-span-8">
            <h1
              id="hero-title"
              className="display text-[length:clamp(2.6rem,13.2cqw,13rem)]"
            >
              {LINES.map((line, i) => (
                <span
                  key={line.text}
                  className="block overflow-hidden pb-[0.06em]"
                  style={{ paddingLeft: line.indent }}
                >
                  <motion.span
                    className={cn(
                      "block",
                      line.outline && "outline-text",
                      line.accent && "text-accent",
                    )}
                    style={interactive ? { x: drifts[i] } : undefined}
                    {...enter(i)}
                  >
                    {line.text}
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>

          {/* Interactive visual */}
          <motion.div className="lg:col-span-4 lg:self-end" {...fade(0.5)}>
            <HeroVisual
              fragments={fragments}
              mx={smx}
              my={smy}
              interactive={interactive}
            />
          </motion.div>
        </div>

        {/* Sub copy, CTAs, metadata */}
        <div className="mt-12 grid gap-10 border-t border-line pt-8 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          <motion.div className="lg:col-span-5" {...fade(0.55)}>
            <p className="max-w-md text-[length:var(--step-1)] leading-snug text-fg">
              {site.tagline}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MagneticButton href="#work">View selected work →</MagneticButton>
              <MagneticButton href="#contact" variant="ghost">
                Let&apos;s talk
              </MagneticButton>
            </div>
          </motion.div>

          <motion.dl
            className="label-mono grid gap-3 text-fg-3 lg:col-span-4 lg:col-start-9 lg:self-end"
            {...fade(0.65)}
          >
            <div className="flex justify-between gap-6 border-b border-line pb-3">
              <dt>Portfolio</dt>
              <dd className="text-fg-2">
                {projectStats.total} selected projects
              </dd>
            </div>
            <div className="flex justify-between gap-6 border-b border-line pb-3">
              <dt>Platforms</dt>
              <dd className="text-fg-2">WordPress / Shopify / Next.js</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt>Based</dt>
              <dd className="text-fg-2">{site.location}</dd>
            </div>
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
