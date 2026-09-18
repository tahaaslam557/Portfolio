import type { ProjectWithMedia } from "@/lib/media";
import { pad } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "./ProjectCard";

export function ProjectIndex({ projects }: { projects: ProjectWithMedia[] }) {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="section-y scroll-mt-20"
    >
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            index="01"
            label="Selected work"
            title={["Selected", "Work"]}
            id="work-title"
          />
          <p className="label-mono max-w-xs text-fg-3">
            <span className="text-fg">({pad(projects.length)})</span> projects,
            presented as case studies. Each links to the live site.
          </p>
        </div>

        <ol className="mt-16 border-b border-line sm:mt-24">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} priority={i === 0} />
          ))}
        </ol>
      </div>
    </section>
  );
}
