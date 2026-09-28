"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/** The name in a handwritten script, "signed" left-to-right when it scrolls into view. */
export function Signature({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  // Observe an unclipped wrapper — a fully clip-pathed element never intersects.
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <span ref={ref} className="block">
      <motion.span
        className={cn(
          "signature block w-fit px-[0.12em] pb-[0.12em] pt-[0.18em] leading-none",
          className,
        )}
        initial={reduced ? false : { clipPath: "inset(0 100% 0 0)" }}
        animate={
          reduced || inView ? { clipPath: "inset(0 0% 0 0)" } : undefined
        }
        transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1] }}
      >
        {name}
      </motion.span>
    </span>
  );
}
