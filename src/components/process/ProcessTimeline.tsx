"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { processSteps } from "@/data/site";
import { ease } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Four steps along a beam that draws itself as you scroll. Each step lights
 * up when the beam reaches it.
 */
export function ProcessTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="section-y scroll-mt-20 border-t border-line bg-surface"
    >
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                index="04"
                label="Process"
                title={["How the", "work gets", "made."]}
                id="process-title"
                size="md"
              />
              <p className="mt-8 max-w-sm text-fg-2">
                A simple sequence, repeated with care. The order matters —
                decisions made early are the ones that make the end result feel
                inevitable.
              </p>
            </div>
          </div>

          <ol
            ref={ref}
            className="relative lg:col-span-6 lg:col-start-7"
            role="list"
          >
            {/* Beam */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-[1.15rem] top-0 w-px bg-line sm:left-6"
            >
              {!reduced && (
                <>
                  <motion.div
                    className="absolute inset-x-0 top-0 h-full origin-top bg-accent"
                    style={{ scaleY }}
                  />
                  <motion.div
                    className="absolute -left-[3px] h-2 w-2 rounded-full bg-accent shadow-[0_0_18px_4px_rgba(255,107,61,0.5)]"
                    style={{ top: glowY }}
                  />
                </>
              )}
            </div>

            {processSteps.map((s, i) => (
              <Step
                key={s.n}
                step={s}
                i={i}
                progress={scrollYProgress}
                reduced={!!reduced}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Step({
  step,
  i,
  progress,
  reduced,
}: {
  step: (typeof processSteps)[number];
  i: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduced: boolean;
}) {
  const at = (i + 0.35) / processSteps.length;
  const lit = useTransform(progress, [at - 0.05, at], [0.35, 1]);

  return (
    <motion.li
      className="relative grid grid-cols-[2.3rem_1fr] gap-x-6 pb-14 last:pb-0 sm:grid-cols-[3rem_1fr] sm:gap-x-10 lg:pb-20"
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: ease.outQuart, delay: 0.05 }}
    >
      <motion.span
        aria-hidden="true"
        className="relative z-10 mt-2 block h-2.5 w-2.5 justify-self-center rounded-full border border-accent bg-bg"
        style={reduced ? undefined : { opacity: lit }}
      />
      <motion.div style={reduced ? undefined : { opacity: lit }}>
        <span className="label-mono text-accent">{step.n}</span>
        <h3 className="display mt-3 text-[length:var(--step-3)]">
          {step.title}
        </h3>
        <p className="mt-4 max-w-md text-fg-2">{step.body}</p>
      </motion.div>
    </motion.li>
  );
}
