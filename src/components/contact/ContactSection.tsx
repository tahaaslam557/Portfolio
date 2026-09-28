"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useCallback, type PointerEvent } from "react";
import { phones, site, socials } from "@/data/site";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "./ContactForm";

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

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <div className="on-dark rounded-lg bg-bg p-6 shadow-[0_30px_80px_-30px_rgba(20,7,10,0.6)] sm:p-10">
              <h3 className="display text-[length:var(--step-2)]">
                Send a message
              </h3>
              <p className="mt-2 text-fg-2">
                Tell me about your project — it goes straight to my inbox.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5 lg:pl-4">
            <p className="max-w-md text-[length:var(--step-1)] leading-snug">
              Available for selected freelance and web projects. Prefer a quick
              chat? Reach me directly.
            </p>
            <dl className="label-mono mt-8 grid gap-3 text-fg-3">
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
              {phones
                .filter((p) => p.call)
                .map((p) => (
                  <div
                    key={`call-${p.digits}`}
                    className="flex justify-between gap-6 border-b border-line pb-3"
                  >
                    <dt>Call</dt>
                    <dd>
                      <a
                        href={`tel:+${p.digits}`}
                        className="link-draw text-fg-2 hover:text-fg"
                      >
                        {p.display}
                      </a>
                    </dd>
                  </div>
                ))}
              <div className="flex justify-between gap-6 border-b border-line pb-3">
                <dt>WhatsApp</dt>
                <dd className="flex flex-col items-end gap-2">
                  {phones.map((p) => (
                    <a
                      key={`wa-${p.digits}`}
                      href={`https://wa.me/${p.digits}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-draw text-fg-2 hover:text-fg"
                    >
                      {p.display} ↗
                    </a>
                  ))}
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
