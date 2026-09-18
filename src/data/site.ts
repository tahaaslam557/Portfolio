/**
 * Site-wide content and configuration.
 * Fill in the TODO fields — nothing here is invented; placeholders are marked.
 */

export const site = {
  name: "Taha Aslam",
  shortName: "TAHA.",
  role: "Web Designer & Frontend Developer",
  tagline: "Turning ambitious ideas into fast, expressive websites.",
  statusLine: "DESIGN / DEVELOPMENT / DIGITAL EXPERIENCES",
  availability: "Available for select projects",
  location: "Remote / Worldwide",
  // TODO: set the real production URL before deploying (used for canonical + OG)
  url: "https://example.com",
  // TODO: replace with the real contact email
  email: "hello@example.com",
  description:
    "Taha Aslam is a web designer and frontend developer building fast, expressive websites with WordPress, Shopify and Next.js.",
};

/**
 * Social / external links. Only links with an `href` are rendered.
 * TODO: add real URLs; leave empty to hide.
 */
export const socials: { label: string; href: string }[] = [
  { label: "Upwork", href: "" },
  { label: "LinkedIn", href: "" },
  { label: "GitHub", href: "" },
];

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/** Sections tracked by the side counter and nav active state. */
export const sections = [
  { id: "hero", label: "Intro" },
  { id: "work", label: "Work" },
  { id: "capabilities", label: "Capabilities" },
  { id: "about", label: "About" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
];

export type Capability = {
  label: string;
  note: string;
  /** slug of the project whose fragment is shown when hovered */
  project: string;
};

export const capabilities: Capability[] = [
  {
    label: "Web Design",
    note: "Layout, type, colour, art direction",
    project: "premium-web-agency",
  },
  {
    label: "Frontend Development",
    note: "Semantic, responsive, fast",
    project: "better-build-sc",
  },
  {
    label: "WordPress",
    note: "Themes, Elementor, custom builds",
    project: "williams-painting-service",
  },
  {
    label: "Elementor",
    note: "Reusable sections, clean structure",
    project: "precision-lock-and-key",
  },
  {
    label: "Shopify",
    note: "Storefronts and theme work",
    project: "antique-barber-supply",
  },
  {
    label: "Next.js",
    note: "React, TypeScript, Tailwind",
    project: "premium-web-agency",
  },
  {
    label: "Responsive UI",
    note: "Designed for every viewport",
    project: "kd-construction",
  },
  {
    label: "Landing Pages",
    note: "Focused, conversion-led pages",
    project: "dreamy-destinations",
  },
  {
    label: "E-commerce",
    note: "WooCommerce and Shopify stores",
    project: "antique-barber-supply",
  },
  {
    label: "Performance",
    note: "Lean assets, measured results",
    project: "better-build-sc",
  },
  {
    label: "UI Animation",
    note: "Motion with a purpose",
    project: "premium-web-agency",
  },
];

export const techStack = [
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "Bootstrap",
  "WordPress",
  "Elementor",
  "Shopify",
  "WooCommerce",
  "HTML",
  "CSS",
  "jQuery",
  "Git",
  "Vercel",
];

export const processSteps = [
  {
    n: "01",
    title: "Discover",
    body: "Understand the goal, the audience and the direction before anything is drawn.",
  },
  {
    n: "02",
    title: "Design",
    body: "Build the visual language and the interface — typography, layout, rhythm.",
  },
  {
    n: "03",
    title: "Develop",
    body: "Turn the design into responsive production code that stays true to it.",
  },
  {
    n: "04",
    title: "Refine",
    body: "Polish motion, responsiveness, accessibility and the details nobody notices — until they're missing.",
  },
];
