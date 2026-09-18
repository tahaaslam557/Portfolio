"use client";

import { motion, useInView, type Variants } from "motion/react";
import { useRef, type ReactNode } from "react";
import { ease } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Tag = "div" | "span" | "p" | "li" | "h2" | "h3";

type Props = {
  children: ReactNode;
  className?: string;
  /** "clip" slides text up out of an overflow-hidden mask; "fade" is a soft rise */
  mode?: "clip" | "fade";
  delay?: number;
  as?: Tag;
};

const clip: Variants = {
  hidden: { y: "105%" },
  show: (d: number) => ({
    y: "0%",
    transition: { duration: 0.9, ease: ease.outExpo, delay: d },
  }),
};

const fade: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: ease.outQuart, delay: d },
  }),
};

const viewport = { once: true, margin: "0px 0px -8% 0px" };

/** In-view reveal. Wrap a line (clip) or a block (fade). */
export function Reveal({
  children,
  className,
  mode = "fade",
  delay = 0,
  as = "div",
}: Props) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];
  const Plain = as;

  // Clip mode observes the *mask*, not the translated child — a child pushed
  // outside an overflow-hidden parent never intersects, so whileInView on it
  // would never fire.
  const maskRef = useRef<HTMLElement>(null);
  const inView = useInView(maskRef, { once: true, margin: "0px 0px -8% 0px" });

  if (reduced) {
    return (
      <Plain className={cn(mode === "clip" && "block", className)}>
        {children}
      </Plain>
    );
  }

  if (mode === "clip") {
    return (
      <Plain
        ref={maskRef as React.Ref<never>}
        className={cn("block overflow-hidden", className)}
      >
        <MotionTag
          className="block"
          variants={clip}
          custom={delay}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
        >
          {children}
        </MotionTag>
      </Plain>
    );
  }

  return (
    <MotionTag
      className={className}
      variants={fade}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      {children}
    </MotionTag>
  );
}
