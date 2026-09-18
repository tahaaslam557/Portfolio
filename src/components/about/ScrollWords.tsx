"use client";

import { useReducedMotion } from "@/lib/hooks";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

const WORDS = ["Design", "Code", "Motion", "Detail"];

function Counter({
  progress,
  n,
}: {
  progress: MotionValue<number>;
  n: number;
}) {
  const index = useTransform(progress, (v) =>
    String(Math.min(n, Math.floor(v * n) + 1)).padStart(2, "0"),
  );
  return (
    <div className="label-mono mb-4 flex items-center gap-4 text-fg-3 sm:mb-6">
      <span>Where the work lives</span>
      <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
      <motion.span className="text-fg">{index}</motion.span>
      <span>/ {String(n).padStart(2, "0")}</span>
    </div>
  );
}

/**
 * A tall sticky stage where one oversized word gives way to the next as you
 * scroll. Reduced motion: the four words are simply listed.
 */
export function ScrollWords() {
  const reduced = useReducedMotion();
  return reduced ? <StaticWords /> : <AnimatedWords />;
}

function StaticWords() {
  return (
    <div className="container-x pb-[var(--section)]">
      <div className="label-mono mb-6 text-fg-3">Where the work lives</div>
      <ul className="display flex flex-wrap gap-x-8 gap-y-2 text-[length:var(--step-4)]">
        {WORDS.map((w) => (
          <li key={w}>
            {w}
            <span className="text-accent">.</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Owns the scroll target so the ref is always mounted while useScroll runs. */
function AnimatedWords() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={ref} className="relative h-[240vh] lg:h-[300vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="container-x relative">
          <Counter progress={scrollYProgress} n={WORDS.length} />
          <div className="relative h-[1.1em] overflow-hidden text-[length:var(--step-5)]">
            {WORDS.map((w, i) => (
              <Word
                key={w}
                word={w}
                i={i}
                n={WORDS.length}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Word({
  word,
  i,
  n,
  progress,
}: {
  word: string;
  i: number;
  n: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / n;
  const start = i * seg;
  const end = start + seg;
  // Inputs must be strictly increasing; the first/last words simply hold
  // their resting value at the edges instead of collapsing a keyframe.
  const inAt = start + seg * 0.2;
  const outAt = end - seg * 0.2;

  // Opacity and a short vertical travel only — no clip-path, so every
  // keyframe interpolates cleanly.
  const opacity = useTransform(
    progress,
    [start, inAt, outAt, end],
    [i === 0 ? 1 : 0, 1, 1, i === n - 1 ? 1 : 0],
  );
  const y = useTransform(
    progress,
    [start, inAt, outAt, end],
    [i === 0 ? "0%" : "110%", "0%", "0%", i === n - 1 ? "0%" : "-110%"],
  );

  return (
    <motion.span
      className={`display absolute inset-x-0 top-0 block will-change-transform ${i % 2 ? "text-accent" : ""}`}
      style={{ opacity, y }}
      aria-hidden={i !== 0}
    >
      {word}
      <span className={i % 2 ? "text-fg" : "text-accent"}>.</span>
    </motion.span>
  );
}
