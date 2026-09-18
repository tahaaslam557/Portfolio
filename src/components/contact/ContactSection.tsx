"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useCallback, type PointerEvent } from "react";
import { site, socials } from "@/data/site";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";

/** The closing statement. Big type, a spotlight that follows the cursor, one clear action. */
export function ContactSection() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const interactive = fine && !reduced;

  const px = useMotionValue(50);
  const py = useMotionValue(50);
  const spx = useSpring(px, { stiffness: 60, damping: 20 });
  const spy = useSpring(py, { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(34rem circle at ${spx}% ${spy}%, rgba(10,10,10,0.10), transparent 70%)`;

  const onMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (!interactive) return;
      const r = e.currentTarget.getBoundingClientRect();
      px.set(((e.clientX - r.left) / r.width) * 100);
      py.set(((e.clientY - r.top) / r.height) * 100);
    },
    [interactive, px, py],
  );

  const links = socials.filter((s) => s.href);

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="on-accent relative isolate scroll-mt-20 overflow-hidden"
      onPointerMove={onMove}
    >
      {interactive && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: spotlight }}
        />
      )}

      <div className="container-x section-y">
        <div className="label-mono flex items-center gap-4 text-fg-3">
          <span className="text-fg">05</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
          <span>Contact</span>
        </div>

        <div className="@container">
          <h2
            id="contact-title"
            className="display mt-8 text-[length:clamp(2.4rem,10.4cqw,12rem)]"
          >
            <Reveal mode="clip" as="span">
              Let&apos;s make
            </Reveal>
            <Reveal mode="clip" as="span" delay={0.08}>
              something
            </Reveal>
            <Reveal mode="clip" as="span" delay={0.16} className="pl-[0.08em]">
              <span className="outline-text">worth</span> clicking.
            </Reveal>
          </h2>
        </div>

        <div className="mt-14 grid gap-10 border-t border-line pt-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="max-w-md text-[length:var(--step-1)] leading-snug">
              Available for selected freelance and web projects.
            </p>
            <div className="mt-8">
              <MagneticButton
                href={`mailto:${site.email}`}
                external
                variant="ink"
              >
                Start a conversation →
              </MagneticButton>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <dl className="label-mono grid gap-3 text-fg-3">
              <div className="flex justify-between gap-6 border-b border-line pb-3">
                <dt>Email</dt>
                <dd>
                  <a
                    href={`mailto:${site.email}`}
                    className="link-draw text-fg-2 hover:text-fg"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
              {links.map((s) => (
                <div
                  key={s.label}
                  className="flex justify-between gap-6 border-b border-line pb-3"
                >
                  <dt>{s.label}</dt>
                  <dd>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-draw text-fg-2 hover:text-fg"
                    >
                      Open ↗
                    </a>
                  </dd>
                </div>
              ))}
              <div className="flex justify-between gap-6">
                <dt>Location</dt>
                <dd className="text-fg-2">{site.location}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
