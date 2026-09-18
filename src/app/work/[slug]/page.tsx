import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentProjects, getProject, projects } from "@/data/projects";
import { withMedia } from "@/lib/media";
import { pad } from "@/lib/utils";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import { ProjectHeader } from "@/components/work/ProjectHeader";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.shortDescription,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      url: `/work/${project.slug}`,
    },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const base = getProject(slug);
  if (!base) notFound();
  const project = withMedia(base);
  const { prev, next } = getAdjacentProjects(slug);
  const host = new URL(project.url).host;

  return (
    <article className="pt-32 lg:pt-40">
      <ProjectHeader project={project} />

      {/* Large preview */}
      <div className="container-x mt-14 sm:mt-20">
        <Reveal>
          <div data-cursor="zoom">
            <ProjectMedia
              src={project.media.hero}
              alt={project.image.alt}
              title={host}
              index={project.index}
              accent={project.accent}
              category={project.category}
              priority
              ratio="aspect-[16/10] sm:aspect-[16/9]"
              sizes="100vw"
            />
          </div>
        </Reveal>
      </div>

      {/* Overview + metadata */}
      <div className="container-x mt-16 grid gap-12 sm:mt-24 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="label-mono text-fg-3">
            <span className="text-accent">What</span> · overview
          </div>
          <Reveal>
            <p className="mt-6 text-[length:var(--step-1)] leading-snug">
              {project.caseStudy?.overview ?? project.shortDescription}
            </p>
          </Reveal>
          {project.caseStudy?.notes?.length ? (
            <Reveal delay={0.1}>
              <div className="label-mono mt-12 text-fg-3">
                <span className="text-accent">Notes</span> · design &amp;
                development
              </div>
              <ul className="mt-6 grid gap-4 text-fg-2">
                {project.caseStudy.notes.map((n) => (
                  <li key={n} className="border-l border-line pl-5">
                    {n}
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <Reveal delay={0.05}>
            <dl className="grid gap-8">
              <MetaBlock
                label="Role"
                items={project.caseStudy?.responsibilities ?? project.services}
              />
              <MetaBlock label="Stack" items={project.tech} />
              <MetaBlock label="Services" items={project.services} />
              {project.results?.length ? (
                <MetaBlock label="Outcome" items={project.results} />
              ) : null}
              {project.year ? (
                <MetaBlock label="Year" items={[String(project.year)]} />
              ) : null}
            </dl>
          </Reveal>
          <div className="mt-10">
            <MagneticButton href={project.url} external>
              Visit live site ↗
            </MagneticButton>
            <p className="label-mono mt-4 text-fg-3">
              Opens {host} in a new tab
            </p>
          </div>
        </aside>
      </div>

      {/* Selected screenshots — 01 is the mobile capture, 02 the desktop below the fold */}
      {project.media.shots.length > 0 && (
        <div className="container-x mt-20 sm:mt-28">
          <div className="label-mono mb-6 text-fg-3">
            <span className="text-accent">Selected</span> · screens
          </div>
          <div className="grid gap-6 sm:grid-cols-12">
            {project.media.shots.map((s, i) => {
              const mobile = i === 0;
              return (
                <Reveal
                  key={s}
                  delay={i * 0.08}
                  className={mobile ? "sm:col-span-4" : "sm:col-span-8"}
                >
                  <div data-cursor="zoom">
                    <ProjectMedia
                      src={s}
                      alt={`${project.title} — ${mobile ? "mobile view" : "desktop, below the fold"}`}
                      title={`${host} — ${mobile ? "mobile" : "desktop"}`}
                      index={project.index}
                      accent={project.accent}
                      ratio={mobile ? "aspect-[4/5]" : "aspect-[16/10]"}
                      sizes={
                        mobile
                          ? "(min-width: 640px) 33vw, 100vw"
                          : "(min-width: 640px) 66vw, 100vw"
                      }
                    />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      )}

      {/* Prev / next */}
      <nav
        aria-label="Other projects"
        className="mt-24 border-t border-line sm:mt-32"
      >
        <div className="container-x grid sm:grid-cols-2">
          {prev && (
            <AdjacentLink
              dir="prev"
              slug={prev.slug}
              title={prev.title}
              index={prev.index}
            />
          )}
          {next && (
            <AdjacentLink
              dir="next"
              slug={next.slug}
              title={next.title}
              index={next.index}
            />
          )}
        </div>
      </nav>
    </article>
  );
}

function MetaBlock({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="border-t border-line pt-4">
      <dt className="label-mono text-fg-3">{label}</dt>
      <dd className="mt-3 grid gap-1.5 text-fg-2">
        {items.map((it) => (
          <span key={it}>{it}</span>
        ))}
      </dd>
    </div>
  );
}

function AdjacentLink({
  dir,
  slug,
  title,
  index,
}: {
  dir: "prev" | "next";
  slug: string;
  title: string;
  index: number;
}) {
  const isNext = dir === "next";
  return (
    <Link
      href={`/work/${slug}`}
      className={`group flex flex-col gap-3 py-10 sm:py-14 ${isNext ? "sm:items-end sm:text-right sm:border-l sm:border-line sm:pl-8" : "border-b border-line sm:border-b-0 sm:pr-8"}`}
      data-cursor="view"
    >
      <span className="label-mono text-fg-3">
        {isNext ? "Next" : "Previous"} · {pad(index)}
      </span>
      <span className="display text-[length:var(--step-3)] transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-1.5 motion-reduce:transition-none">
        {isNext ? `${title} →` : `← ${title}`}
      </span>
    </Link>
  );
}
