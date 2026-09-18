import type { Transition, Variants } from "motion/react";

/** Shared easing + duration tokens. Keep in sync with globals.css. */
export const ease = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  outQuart: [0.25, 1, 0.5, 1] as const,
  inOutQuart: [0.76, 0, 0.24, 1] as const,
};

export const dur = {
  micro: 0.22,
  normal: 0.55,
  hero: 0.9,
};

export const spring = {
  soft: {
    type: "spring",
    stiffness: 120,
    damping: 20,
    mass: 0.6,
  } satisfies Transition,
  snappy: { type: "spring", stiffness: 400, damping: 30 } satisfies Transition,
  magnetic: {
    type: "spring",
    stiffness: 250,
    damping: 18,
    mass: 0.4,
  } satisfies Transition,
};

/** Clip-up reveal used for headings. Parent controls stagger. */
export const clipUp: Variants = {
  hidden: { y: "110%", rotate: 2 },
  show: (i: number = 0) => ({
    y: "0%",
    rotate: 0,
    transition: { duration: dur.hero, ease: ease.outExpo, delay: i * 0.08 },
  }),
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: dur.normal, ease: ease.outQuart, delay: i * 0.06 },
  }),
};

export const stagger = (
  staggerChildren = 0.08,
  delayChildren = 0,
): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});
