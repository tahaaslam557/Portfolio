import Link from "next/link";
import type { ProjectWithMedia } from "@/lib/media";
import { projects } from "@/data/projects";
import { pad } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export function ProjectHeader({ project }: { project: ProjectWithMedia }) {
  return (
    <header className="container-x">
      <div className="label-mono flex flex-wrap items-center gap-4 text-fg-3">
        <Link href="/#work" className="link-draw text-fg-2 hover:text-fg">
          ← Work
        </Link>
        <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
        <span>
          <span className="text-accent">{pad(project.index)}</span> /{" "}
          {pad(projects.length)}
        </span>
        <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
        <span>{project.category}</span>
      </div>

      <div className="@container">
        <h1 className="display mt-8 text-[length:clamp(2.4rem,9.5cqw,11rem)]">
          {project.title.split(" ").map((w, i) => (
            <Reveal
              key={`${w}-${i}`}
              mode="clip"
              as="span"
              delay={i * 0.06}
              className="inline-block pr-[0.22em]"
            >
              {w}
            </Reveal>
          ))}
        </h1>
      </div>

      <Reveal delay={0.2}>
        <p className="mt-8 max-w-2xl text-[length:var(--step-1)] leading-snug text-fg-2">
          {project.shortDescription}
        </p>
      </Reveal>
    </header>
  );
}
