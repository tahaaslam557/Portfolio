"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { ProjectWithMedia } from "@/lib/media";
import { ease } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks";
import { cn, pad } from "@/lib/utils";
import { ProjectMedia } from "./ProjectMedia";

type Props = { project: ProjectWithMedia; priority?: boolean };

const viewport = { once: true, margin: "0px 0px -10% 0px" };

/**
 * One entry in the curated gallery. Four layout variants alternate down the
 * page so the section reads as an edited sequence rather than a grid.
 */
export function ProjectCard({ project, priority }: Props) {
  const reduced = useReducedMotion();
  const { layout } = project;
  const href = `/work/${project.slug}`;

  const mediaMotion = reduced
    ? {}
    : {
        initial: { opacity: 0, scale: 0.96, y: 24 },
        whileInView: { opacity: 1, scale: 1, y: 0 },
        viewport,
        transition: { duration: 0.9, ease: ease.outExpo },
      };

  const media = (
    <motion.div
      className="group/media relative isolate"
      style={{ "--p": project.accent } as React.CSSProperties}
      {...mediaMotion}
    >
      {/* the project's own colour, as a soft light behind the frame */}
      <div
        aria-hidden="true"
        className="absolute -inset-x-6 -bottom-8 -top-6 -z-10 rounded-[2rem] opacity-60 blur-2xl transition-opacity duration-700 group-hover:opacity-90"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 60%, var(--p), transparent 75%)",
        }}
      />
      <div className="overflow-hidden rounded-md ring-1 ring-line">
        <div className="transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.035] motion-reduce:transition-none">
          <ProjectMedia
            src={project.media.hero}
            alt={project.image.alt}
            title={project.title}
            index={project.index}
            accent={project.accent}
            category={project.category}
            priority={priority}
            ratio={
              layout === "full"
                ? "aspect-[16/9] sm:aspect-[21/9]"
                : "aspect-[16/11] sm:aspect-[16/10]"
            }
            sizes={
              layout === "full" ? "100vw" : "(min-width: 1024px) 60vw, 100vw"
            }
          />
        </div>
      </div>
      {/* accent line draws in on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-[var(--p)] transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </motion.div>
  );

  const meta = (
    <div
      className={cn(
        "flex flex-col justify-between gap-6",
        layout === "full" && "sm:flex-row sm:items-end",
      )}
    >
      <div>
        <div className="label-mono flex items-center gap-3 text-fg-3">
          <span style={{ color: project.accent }}>{pad(project.index)}</span>
          <span className="h-px w-6 bg-line-strong" aria-hidden="true" />
          <span>{project.category}</span>
        </div>
        <h3 className="display mt-4 text-[length:clamp(1.75rem,2.6vw,3.2rem)] transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-1.5 motion-reduce:transition-none">
          {project.title}
        </h3>
        <p className="mt-4 max-w-md text-fg-2">{project.shortDescription}</p>
      </div>
      <dl className="label-mono grid gap-2 text-fg-3 sm:min-w-56">
        <div className="flex justify-between gap-4 border-b border-line pb-2">
          <dt>Platform</dt>
          <dd className="text-fg-2">{project.platform}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-line pb-2">
          <dt>Stack</dt>
          <dd className="text-right text-fg-2">
            {project.tech.slice(0, 3).join(" / ")}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 pt-1">
          <dt className="sr-only">Action</dt>
          <dd className="flex items-center gap-2 text-fg opacity-70 transition-opacity group-hover:opacity-100">
            View project
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </dd>
        </div>
      </dl>
    </div>
  );

  return (
    <li className="border-t border-line py-10 sm:py-14 lg:py-20">
      <Link
        href={href}
        className={cn(
          "group grid gap-8 outline-none lg:gap-12",
          layout === "lead" &&
            "lg:grid-cols-12 lg:items-end [&>*:first-child]:lg:col-span-8 [&>*:last-child]:lg:col-span-4",
          layout === "reverse" &&
            "lg:grid-cols-12 lg:items-end [&>*:first-child]:lg:col-span-8 [&>*:first-child]:lg:col-start-5 [&>*:first-child]:lg:row-start-1 [&>*:last-child]:lg:col-span-4 [&>*:last-child]:lg:col-start-1 [&>*:last-child]:lg:row-start-1",
          layout === "full" && "",
          layout === "split" &&
            "lg:grid-cols-12 lg:items-start [&>*:first-child]:lg:col-span-7 [&>*:first-child]:lg:col-start-2 [&>*:last-child]:lg:col-span-3 [&>*:last-child]:lg:col-start-10 [&>*:last-child]:lg:pt-16",
        )}
        data-cursor="view"
        aria-label={`${project.title} — ${project.category}`}
      >
        {media}
        {meta}
      </Link>
    </li>
  );
}
