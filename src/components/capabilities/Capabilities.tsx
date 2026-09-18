"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { capabilities } from "@/data/site";
import type { ProjectFragment } from "@/lib/media";
import { ease } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks";
import { cn, pad } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectMedia } from "@/components/work/ProjectMedia";

type Props = { projects: ProjectFragment[] };

/**
 * An interactive index: hovering / focusing a capability swaps the preview
 * panel to a fragment of a related real project. On touch, tapping selects.
 */
export function Capabilities({ projects }: Props) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const cap = capabilities[active];
  const project = projects.find((p) => p.slug === cap.project) ?? projects[0];

  return (
    <section
      id="capabilities"
      aria-labelledby="cap-title"
      className="section-y scroll-mt-20 border-t border-line"
    >
      <div className="container-x">
        <SectionHeading
          index="02"
          label="Capabilities"
          title={["I turn ideas", "into interfaces."]}
          id="cap-title"
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Preview panel — sticky on desktop, above the list on mobile */}
          <div className="order-first lg:order-none lg:col-span-5 lg:col-start-8">
            <div className="lg:sticky lg:top-28">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-line bg-surface shadow-[0_40px_120px_-40px_rgba(255,107,61,0.35)]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={project.slug + active}
                    className="absolute inset-0"
                    initial={reduced ? false : { opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: ease.outQuart }}
                  >
                    <ProjectMedia
                      src={project.media.hero}
                      alt={project.alt}
                      title={project.title}
                      index={project.index}
                      accent={project.accent}
                      category={project.category}
                      ratio="h-full"
                      sizes="(min-width: 1024px) 40vw, 100vw"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="label-mono mt-4 flex items-center justify-between text-fg-3">
                <span>
                  <span className="text-accent">{pad(active + 1)}</span> ·{" "}
                  {cap.label}
                </span>
                <Link
                  href={`/work/${project.slug}`}
                  className="link-draw text-fg-2 hover:text-fg"
                  data-cursor="view"
                >
                  {project.title} →
                </Link>
              </div>
            </div>
          </div>

          {/* Index list */}
          <ul
            className="lg:col-span-6 lg:col-start-1 lg:row-start-1"
            role="list"
          >
            {capabilities.map((c, i) => {
              const on = i === active;
              return (
                <li
                  key={c.label}
                  className="border-t border-line last:border-b"
                >
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className={cn(
                      "flex w-full items-baseline justify-between gap-6 py-4 text-left transition-colors duration-300 sm:py-5",
                      on ? "text-accent" : "text-fg-3 hover:text-fg-2",
                    )}
                  >
                    <span className="flex items-baseline gap-4 sm:gap-6">
                      <span className="label-mono w-6 shrink-0">
                        {pad(i + 1)}
                      </span>
                      <span
                        className={cn(
                          "display text-[length:var(--step-2)] transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)]",
                          on && "translate-x-2",
                        )}
                      >
                        {c.label}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "label-mono hidden text-right transition-opacity duration-300 sm:block",
                        on ? "opacity-100" : "opacity-0",
                      )}
                    >
                      {c.note}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
