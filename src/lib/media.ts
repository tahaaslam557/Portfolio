import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import { projects, type Project } from "@/data/projects";

export type ProjectMediaSet = {
  hero: string | null;
  shots: string[];
};

export type ProjectWithMedia = Project & { media: ProjectMediaSet };

const PUBLIC = path.join(process.cwd(), "public");

/**
 * Resolves which project images actually exist on disk at build time, so the
 * UI can render a designed placeholder instead of a broken (or fake) image.
 */
export function resolveMedia(project: Project): ProjectMediaSet {
  const exists = (p: string) => existsSync(path.join(PUBLIC, p));
  return {
    hero: exists(project.image.hero) ? project.image.hero : null,
    shots: project.image.shots.filter(exists),
  };
}

export function withMedia(project: Project): ProjectWithMedia {
  return { ...project, media: resolveMedia(project) };
}

export function getProjectsWithMedia(): ProjectWithMedia[] {
  return projects.map(withMedia);
}

/** The minimum a client component needs to render a project fragment. */
export type ProjectFragment = Pick<
  ProjectWithMedia,
  "slug" | "title" | "index" | "accent" | "category" | "media"
> & { alt: string };

export function toFragment(p: ProjectWithMedia): ProjectFragment {
  return {
    slug: p.slug,
    title: p.title,
    index: p.index,
    accent: p.accent,
    category: p.category,
    media: { hero: p.media.hero, shots: [] },
    alt: p.image.alt,
  };
}
