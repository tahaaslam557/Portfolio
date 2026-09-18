"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navLinks, sections, site } from "@/data/site";
import { ease } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks";
import { cn, pad } from "@/lib/utils";
import { useIntro } from "@/components/intro/IntroProvider";

export function SiteNav() {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  // Menu is "open" only for the path it was opened on — navigating closes it without an effect.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const [active, setActive] = useState("hero");
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { ready } = useIntro();
  const isHome = pathname === "/";
  const open = openAt === pathname;
  const setOpen = (v: boolean) => setOpenAt(v ? pathname : null);

  useMotionValueEvent(scrollY, "change", (y) => setCompact(y > 48));

  // Track the section in view for the active indicator + side counter.
  useEffect(() => {
    if (!isHome) return;
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isHome, pathname]);

  // Close menu on route change / escape, lock scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenAt(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (open) firstLinkRef.current?.focus();
  }, [open]);

  const href = (h: string) => (isHome ? h : `/${h}`);
  const activeIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === active),
  );

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[75] flex justify-center px-[var(--gutter)] pt-4 sm:pt-5"
        initial={reduced ? false : { y: -24, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: ease.outExpo, delay: 0.2 }}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "flex w-full items-center justify-between transition-[max-width,padding,background-color,border-color,backdrop-filter] duration-500 [transition-timing-function:var(--ease-out-expo)]",
            "rounded-full border px-4 py-2 sm:px-5",
            compact || open
              ? "max-w-[52rem] border-line bg-bg/70 backdrop-blur-md"
              : "max-w-[var(--container)] border-transparent bg-transparent",
          )}
        >
          <Link
            href="/"
            className="display text-[1.15rem] tracking-[-0.02em]"
            aria-label={`${site.name} — home`}
          >
            {site.shortName}
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <ul className="flex items-center gap-6">
              {navLinks.map((l) => {
                const id = l.href.replace("#", "");
                const isActive = isHome && active === id;
                return (
                  <li key={l.href}>
                    <Link
                      href={href(l.href)}
                      className={cn(
                        "label-mono link-draw py-2 transition-colors",
                        isActive ? "text-fg" : "text-fg-2 hover:text-fg",
                      )}
                      aria-current={isActive ? "location" : undefined}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <span className="label-mono hidden items-center gap-2 text-fg-3 lg:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              {site.availability}
            </span>
          </div>

          <button
            type="button"
            className="label-mono flex min-h-11 items-center gap-2 px-2 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? "Close" : "Menu"}
            <span className="relative block h-3 w-4" aria-hidden="true">
              <span
                className={cn(
                  "absolute inset-x-0 top-0 h-px bg-fg transition-transform duration-300",
                  open && "translate-y-[5.5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-px bg-fg transition-transform duration-300",
                  open && "-translate-y-[5.5px] -rotate-45",
                )}
              />
            </span>
          </button>
        </nav>
      </motion.header>

      {/* Side section counter — desktop, home only */}
      {isHome && (
        <div
          aria-hidden="true"
          className="label-mono fixed right-6 top-1/2 z-[60] hidden -translate-y-1/2 rotate-90 origin-right items-center gap-3 text-fg-3 xl:flex"
        >
          <span className="text-fg">{pad(activeIndex + 1)}</span>
          <span className="h-px w-6 bg-line-strong" />
          <span>{sections[activeIndex]?.label}</span>
          <span className="h-px w-6 bg-line-strong" />
          <span>{pad(sections.length)}</span>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[74] flex flex-col justify-end bg-bg px-[var(--gutter)] pb-10 pt-28 md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduced ? 0 : 0.6, ease: ease.inOutQuart }}
          >
            <ul className="grid gap-2">
              {navLinks.map((l, i) => (
                <li
                  key={l.href}
                  className="overflow-hidden border-b border-line"
                >
                  <motion.div
                    initial={reduced ? false : { y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.7,
                      ease: ease.outExpo,
                      delay: 0.15 + i * 0.06,
                    }}
                  >
                    <Link
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={href(l.href)}
                      onClick={() => setOpen(false)}
                      className="display flex items-baseline justify-between py-4 text-[length:var(--step-3)]"
                    >
                      {l.label}
                      <span className="label-mono text-fg-3">{pad(i + 1)}</span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            <div className="label-mono mt-10 flex flex-col gap-3 text-fg-3 xs:flex-row xs:items-center xs:justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent" />
                {site.availability}
              </span>
              <span>{site.location}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
