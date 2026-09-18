"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import Link from "next/link";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "ink";
  external?: boolean;
  className?: string;
  strength?: number;
};

/**
 * A button with a subtle magnetic pull toward the cursor (desktop only).
 * Behaves as a plain link for touch and reduced-motion users.
 */
export function MagneticButton({
  href,
  children,
  variant = "primary",
  external,
  className,
  strength = 0.3,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring.magnetic);
  const sy = useSpring(y, spring.magnetic);
  const active = fine && !reduced;

  const onMove = (e: MouseEvent) => {
    if (!active || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const classes = cn(
    "group inline-flex min-h-12 items-center gap-3 rounded-full px-6 py-3 label-mono transition-colors duration-300",
    variant === "primary" &&
      "bg-fg text-bg hover:bg-accent focus-visible:bg-accent",
    variant === "ghost" && "border border-line-strong text-fg hover:border-fg",
    variant === "ink" &&
      "bg-accent-ink text-accent hover:bg-fg hover:text-accent-ink",
    className,
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          data-cursor="open"
        >
          {children}
        </a>
      ) : (
        <Link href={href} className={classes} data-cursor="open">
          {children}
        </Link>
      )}
    </motion.div>
  );
}
