"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { ease } from "@/lib/motion";
import { isIntroDone, markIntroDone, useIntro } from "./IntroProvider";

const NAME = site.name.toUpperCase().split(" ");
const TOTAL_MS = 1500;

/**
 * Short typographic intro. Runs once per session, skipped for reduced motion.
 * No fake percentage — the line is a real timer for the reveal itself.
 */
export function IntroLoader() {
  const { ready } = useIntro();
  const [leaving, setLeaving] = useState(false);

  // Start the exit timer only when the intro is actually running.
  useEffect(() => {
    if (isIntroDone()) return;
    const t = setTimeout(() => setLeaving(true), TOTAL_MS);
    // Escape hatch: any key or click ends it early.
    const end = () => setLeaving(true);
    window.addEventListener("keydown", end);
    window.addEventListener("pointerdown", end);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", end);
      window.removeEventListener("pointerdown", end);
    };
  }, []);

  // Hand over to the page as soon as the wipe starts so the hero rises underneath it.
  useEffect(() => {
    if (leaving) markIntroDone();
  }, [leaving]);

  return (
    <AnimatePresence>
      {!leaving && !ready && (
        <motion.div
          id="intro-loader"
          role="status"
          aria-live="polite"
          aria-label="Loading"
          className="fixed inset-0 z-[90] flex flex-col justify-between bg-bg px-[var(--gutter)] py-8"
          initial={false}
          exit={{
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: 0.8, ease: ease.inOutQuart },
          }}
        >
          <div className="label-mono text-fg-3">
            <span className="text-accent">●</span> {site.location}
          </div>

          <div>
            <div
              className="display text-[length:var(--step-4)] overflow-hidden"
              aria-hidden="true"
            >
              {NAME.map((word, i) => (
                <span key={word} className="block overflow-hidden">
                  <motion.span
                    className={i ? "block text-accent" : "block"}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      duration: 0.9,
                      ease: ease.outExpo,
                      delay: 0.1 + i * 0.1,
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </div>
            <motion.p
              className="label-mono mt-6 text-fg-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {site.statusLine}
            </motion.p>
          </div>

          <div className="relative h-px w-full bg-line">
            <motion.div
              className="absolute inset-y-0 left-0 bg-accent"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: TOTAL_MS / 1000 - 0.2,
                ease: ease.inOutQuart,
                delay: 0.1,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
