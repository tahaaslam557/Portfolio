"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import Link from "next/link";
import type { ProjectFragment } from "@/lib/media";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import { pad } from "@/lib/utils";

type Props = {
  fragments: ProjectFragment[];
  mx: MotionValue<number>;
  my: MotionValue<number>;
  interactive: boolean;
};

/**
 * An art-directed "portfolio canvas": a framed window that tilts toward the
 * cursor, holding fragments of real projects at different depths. Pure CSS
 * transforms — no canvas, no WebGL.
 */
export function HeroVisual({ fragments, mx, my, interactive }: Props) {
  const rotateY = useTransform(mx, [-0.5, 0.5], [-7, 7]);
  const rotateX = useTransform(my, [-0.5, 0.5], [6, -6]);

  // Each layer moves a different amount for depth.
  const l1x = useTransform(mx, [-0.5, 0.5], [-10, 10]);
  const l1y = useTransform(my, [-0.5, 0.5], [-8, 8]);
  const l2x = useTransform(mx, [-0.5, 0.5], [18, -18]);
  const l2y = useTransform(my, [-0.5, 0.5], [14, -14]);
  const l3x = useTransform(mx, [-0.5, 0.5], [-26, 26]);
  const l3y = useTransform(my, [-0.5, 0.5], [-20, 20]);

  const [a, b, c] = fragments;
  const tilt = interactive ? { rotateX, rotateY } : undefined;

  return (
    <div
      className="relative mx-auto w-full max-w-md lg:max-w-none"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        className="relative aspect-[4/5] w-full rounded-lg border border-line-strong bg-surface p-3 shadow-[0_60px_140px_-40px_rgba(255,107,61,0.45)] sm:p-4"
        style={{ ...tilt, transformStyle: "preserve-3d" }}
      >
        {/* Window chrome */}
        <div className="label-mono flex items-center justify-between text-fg-3">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
            <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span>Selected work</span>
        </div>

        <div className="relative mt-3 h-[calc(100%-1.5rem)] overflow-hidden rounded-sm">
          {/* Ruled backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-line) 1px, transparent 1px)",
              backgroundSize: "100% 28px",
            }}
          />

          {a && (
            <motion.div
              className="absolute left-[6%] top-[8%] w-[74%]"
              style={interactive ? { x: l1x, y: l1y, z: 10 } : undefined}
            >
              <Fragment project={a} priority />
            </motion.div>
          )}
          {b && (
            <motion.div
              className="absolute right-[4%] top-[42%] w-[64%]"
              style={interactive ? { x: l2x, y: l2y, z: 40 } : undefined}
            >
              <Fragment project={b} />
            </motion.div>
          )}
          {c && (
            <motion.div
              className="absolute bottom-[5%] left-[10%] w-[52%]"
              style={interactive ? { x: l3x, y: l3y, z: 70 } : undefined}
            >
              <Fragment project={c} />
            </motion.div>
          )}

          {/* Floating tag */}
          <motion.div
            aria-hidden="true"
            className="label-mono absolute right-[8%] top-[10%] rounded-full bg-accent px-3 py-2 text-accent-ink"
            style={interactive ? { x: l3x, y: l3y, z: 90 } : undefined}
          >
            Live ↗
          </motion.div>
        </div>
      </motion.div>

      {/* Caption */}
      <div className="label-mono mt-3 flex justify-between text-fg-3">
        <span>Fragments of real projects</span>
        <span>
          {pad(fragments.length)} / {pad(fragments.length)}
        </span>
      </div>
    </div>
  );
}

function Fragment({
  project,
  priority,
}: {
  project: ProjectFragment;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block overflow-hidden rounded-sm border border-line bg-surface-2 shadow-frame transition-colors hover:border-line-strong"
      data-cursor="view"
      aria-label={`${project.title} — view project`}
    >
      <ProjectMedia
        src={project.media.hero}
        alt={project.alt}
        title={project.title}
        index={project.index}
        accent={project.accent}
        category={project.category}
        priority={priority}
        framed={false}
        ratio="aspect-[16/10]"
        sizes="(min-width: 1024px) 24vw, 70vw"
      />
      <div className="label-mono flex items-center justify-between px-3 py-2 text-[0.58rem] text-fg-3">
        <span className="truncate text-fg-2">{project.title}</span>
        <span>{pad(project.index)}</span>
      </div>
    </Link>
  );
}
