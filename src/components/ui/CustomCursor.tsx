"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useEffect, useState } from "react";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";

type CursorMode = "default" | "view" | "open" | "zoom";
const LABELS: Record<CursorMode, string | null> = {
  default: null,
  view: "View",
  open: "Open",
  zoom: null,
};

/**
 * A trailing cursor companion — desktop only. The native cursor is never
 * hidden; this ring follows it with a spring and expands into a label over
 * projects (`data-cursor="view"`), CTAs (`open`) and images (`zoom`).
 */
export function CustomCursor() {
  const finePointer = useFinePointer();
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.3 });

  const enabled = finePointer && !reduced;

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = (e.target as Element | null)?.closest<HTMLElement>(
        "[data-cursor]",
      );
      const next =
        (target?.dataset.cursor as CursorMode | undefined) ?? "default";
      setMode((m) => (m === next ? m : next));
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const label = LABELS[mode];
  const size = mode === "default" ? 12 : mode === "zoom" ? 56 : 72;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[80] mix-blend-difference"
      style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
    >
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-fg"
        animate={{ width: size, height: size }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              className="label-mono text-bg"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.18 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
