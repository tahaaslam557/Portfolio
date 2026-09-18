/**
 * Centralised project data.
 *
 * Rules:
 * - Only verifiable facts. Platform/tech was checked against each live site's
 *   markup (generator tags, asset paths). Descriptions come from what the
 *   sites themselves say they do.
 * - No invented dates, results, testimonials or client statistics.
 * - Images live in /public/projects/<slug>/ — run `npm run capture` to
 *   (re)generate real screenshots with headless Chrome. When a file is
 *   missing the UI falls back to a designed placeholder, never a fake shot.
 */

export type Platform = "WordPress" | "Shopify" | "Next.js" | "Custom";

export type Project = {
  id: string;
  index: number;
  title: string;
  slug: string;
  url: string;
  category: string;
  platform: Platform;
  shortDescription: string;
  year?: number; // only when verified
  services: string[];
  tech: string[];
  image: {
    hero: string;
    shots: string[];
    alt: string;
  };
  featured: boolean;
  accent: string;
  layout: "lead" | "reverse" | "full" | "split";
  caseStudy?: {
    overview: string;
    responsibilities: string[];
    notes: string[];
  };
  results?: string[]; // only documented outcomes
};

const img = (slug: string, shots: number, alt: string) => ({
  hero: `/projects/${slug}/hero.webp`,
  shots: Array.from(
    { length: shots },
    (_, i) => `/projects/${slug}/0${i + 1}.webp`,
  ),
  alt,
});

export const projects: Project[] = [
  {
    id: "dreamy-destinations",
    index: 1,
    title: "Dreamy Destinations",
    slug: "dreamy-destinations",
    url: "https://dreamydestinations.net",
    category: "Travel vouchers",
    platform: "WordPress",
    shortDescription:
      "A travel-incentive site selling hotel, flight and cruise voucher packages, built on WordPress with WooCommerce and Easy Digital Downloads.",
    services: ["Web Design", "WordPress Development", "E-commerce"],
    tech: ["WordPress", "Elementor", "WooCommerce", "Easy Digital Downloads"],
    image: img("dreamy-destinations", 2, "Dreamy Destinations website"),
    featured: true,
    accent: "#8FB3FF",
    layout: "lead",
    caseStudy: {
      overview:
        "Dreamy Destinations markets voucher-based travel offers — hotel stays, airline vouchers and cruise deals. The site needed to explain a multi-step offer clearly and let visitors purchase packages directly.",
      responsibilities: [
        "Page design and layout in Elementor",
        "WooCommerce and Easy Digital Downloads product setup",
        "Responsive implementation across devices",
      ],
      notes: [
        "The offer flow is long-form by nature, so sections were structured as a guided sequence rather than a wall of features.",
        "Commerce is handled natively in WordPress to keep the stack simple for the client to maintain.",
      ],
    },
  },
  {
    id: "precision-lock-key",
    index: 2,
    title: "Precision Lock & Key",
    slug: "precision-lock-and-key",
    url: "https://precisionlockandkey.org",
    category: "Local service · Locksmith",
    platform: "WordPress",
    shortDescription:
      "A service website for an automotive and residential locksmith — key cutting, key fobs, lockouts — built to convert calls.",
    services: ["Web Design", "WordPress Development"],
    tech: ["WordPress", "Elementor"],
    image: img("precision-lock-and-key", 2, "Precision Lock & Key website"),
    featured: true,
    accent: "#FFB86B",
    layout: "reverse",
    caseStudy: {
      overview:
        "Precision Lock & Key offers automotive locksmith services, key duplication and key fob replacement. The site presents services plainly with a strong path to contact.",
      responsibilities: [
        "Service-led page structure and design",
        "Elementor build with reusable sections",
        "Mobile-first layout for on-the-go visitors",
      ],
      notes: [
        "Locksmith customers are often searching on a phone in a hurry — the layout keeps contact actions within reach on every screen.",
      ],
    },
  },
  {
    id: "williams-painting",
    index: 3,
    title: "Williams Painting Service",
    slug: "williams-painting-service",
    url: "https://williamspaintingservice.com",
    category: "Local service · Painting",
    platform: "WordPress",
    shortDescription:
      "Website for a residential and commercial painting company serving Branson, Missouri and surrounding areas.",
    services: ["Web Design", "WordPress Development", "SEO Setup"],
    tech: ["WordPress", "Elementor", "Site Kit"],
    image: img(
      "williams-painting-service",
      2,
      "Williams Painting Service website",
    ),
    featured: true,
    accent: "#F5F5F0",
    layout: "full",
    caseStudy: {
      overview:
        "Williams Painting Service provides interior and exterior painting across the Branson area. The site is built around local service pages, project imagery and a free-estimate call to action.",
      responsibilities: [
        "Design and Elementor implementation",
        "Local-area service content structure",
        "Google Site Kit integration for search tooling",
      ],
      notes: [
        "Before/after imagery does the persuading, so the layout gives photography room and keeps copy short.",
      ],
    },
  },
  {
    id: "build-with-cfc",
    index: 4,
    title: "Better Build SC",
    slug: "better-build-sc",
    url: "https://buildwithcfc.vercel.app",
    category: "Construction · Design-build firm",
    platform: "Custom",
    shortDescription:
      "A custom-coded site for a South Carolina design-build firm covering new construction, renovation, custom doors and windows and millwork.",
    services: ["Web Design", "Frontend Development"],
    tech: ["HTML", "CSS", "JavaScript", "Vercel"],
    image: img("better-build-sc", 2, "Better Build SC website"),
    featured: true,
    accent: "#C9A27E",
    layout: "split",
    caseStudy: {
      overview:
        "Better Build SC is a design-build firm in Columbia, SC offering complete construction services and supplies. The site introduces the team, their services and project gallery, deployed on Vercel.",
      responsibilities: [
        "Visual design and page composition",
        "Hand-coded responsive frontend",
        "Deployment on Vercel",
      ],
      notes: [
        "Built without a CMS to keep the page lightweight and fast, with a simple structure the client can extend.",
      ],
    },
  },
  {
    id: "dockery-ministries",
    index: 5,
    title: "Dockery Ministries",
    slug: "dockery-ministries",
    url: "https://dockeryministriesincorporated.developerstagging.com",
    category: "Ministry · Content site",
    platform: "WordPress",
    shortDescription:
      "A WordPress content site for Dockery Ministries Incorporated, publishing a series of prayer-focused articles.",
    services: ["Web Design", "WordPress Development"],
    tech: ["WordPress"],
    image: img("dockery-ministries", 2, "Dockery Ministries website"),
    featured: false,
    accent: "#B8A9FF",
    layout: "lead",
    caseStudy: {
      overview:
        "Dockery Ministries needed a calm, readable home for its writing — a series of posts on prayer. The build is a straightforward WordPress site with a focus on typography and reading comfort.",
      responsibilities: [
        "Theme design and setup",
        "Post structure and layout",
        "Staging deployment",
      ],
      notes: [
        "Content-first: the design steps back so the writing carries the page.",
      ],
    },
  },
  {
    id: "premium-web-agency",
    index: 6,
    title: "Premium Web Agency",
    slug: "premium-web-agency",
    url: "https://premiumwebagency-seven.vercel.app",
    category: "Agency · Digital products",
    platform: "Next.js",
    shortDescription:
      "A Next.js website for an AI-native digital agency spanning web platforms, commerce, apps and growth services.",
    services: ["Web Design", "Frontend Development", "Next.js"],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
    image: img("premium-web-agency", 2, "Premium Web Agency website"),
    featured: true,
    accent: "#FF6B3D",
    layout: "reverse",
    caseStudy: {
      overview:
        "Premium Web Agency positions itself around AI-native digital products — web platforms, commerce, apps and growth. The site is a component-driven Next.js build deployed on Vercel.",
      responsibilities: [
        "Design system and component architecture",
        "Next.js / React implementation",
        "Responsive and interaction polish",
      ],
      notes: [
        "Built as reusable sections so new service pages can be composed rather than redesigned.",
      ],
    },
  },
  {
    id: "absi",
    index: 7,
    title: "Antique Barber Supply",
    slug: "antique-barber-supply",
    url: "https://absi.developerstagging.com",
    category: "E-commerce · Barber equipment",
    platform: "WordPress",
    shortDescription:
      "A WooCommerce store for professional barber chairs, workstations and grooming tools.",
    services: ["Web Design", "WordPress Development", "E-commerce"],
    tech: ["WordPress", "Elementor", "WooCommerce"],
    image: img("antique-barber-supply", 2, "Antique Barber Supply store"),
    featured: true,
    accent: "#FF8A7A",
    layout: "full",
    caseStudy: {
      overview:
        "Antique Barber Supply INC sells premium barbershop equipment. The store presents product ranges — chairs, workstations, accessories — with a clean catalogue and standard WooCommerce checkout.",
      responsibilities: [
        "Store design and product page layout",
        "WooCommerce configuration",
        "Elementor implementation",
      ],
      notes: [
        "Product photography is the hero; layout and colour stay restrained so the equipment reads as premium.",
      ],
    },
  },
  {
    id: "simla",
    index: 8,
    title: "Simla",
    slug: "simla",
    url: "https://simla.preliveview.com",
    category: "IT services · B2B",
    platform: "WordPress",
    shortDescription:
      "A business site for SIMLA LLC — managed IT, 24/7 support, secure networks and cloud migration.",
    services: ["Web Design", "WordPress Development"],
    tech: ["WordPress", "Elementor", "Astra"],
    image: img("simla", 2, "Simla website"),
    featured: false,
    accent: "#6FD3FF",
    layout: "split",
    caseStudy: {
      overview:
        "SIMLA LLC provides managed IT and cloud services to businesses. The site organises a broad service list into clear groups and explains who they serve.",
      responsibilities: [
        "Page design",
        "Elementor build on the Astra theme",
        "Responsive QA",
      ],
      notes: [
        "Dense B2B service content was broken into scannable sections with consistent hierarchy.",
      ],
    },
  },
  {
    id: "kd-construction",
    index: 9,
    title: "KD Construction",
    slug: "kd-construction",
    url: "https://kdconstruction.developerstagging.com/",
    category: "Construction · Pole barns",
    platform: "WordPress",
    shortDescription:
      "Website for a custom pole barn builder serving Murfreesboro, Tennessee — estimates, warranty details and careers.",
    services: ["Web Design", "WordPress Development"],
    tech: ["WordPress", "Elementor"],
    image: img("kd-construction", 2, "KD Construction website"),
    featured: false,
    accent: "#E8C36A",
    layout: "lead",
    caseStudy: {
      overview:
        "KD Construction builds custom pole barns and structures. The site leads with the core offer, trust points such as warranty and free estimates, and a careers section.",
      responsibilities: [
        "Design and Elementor implementation",
        "Content structure",
        "Staging deployment",
      ],
      notes: [
        "Strong, simple hierarchy: offer → proof → contact, repeated consistently on mobile.",
      ],
    },
  },
  {
    id: "rhpac",
    index: 10,
    title: "Regency Health & Professionals",
    slug: "regency-health-and-professionals",
    url: "https://rhpac.preliveview.com/",
    category: "Healthcare · Clinic",
    platform: "WordPress",
    shortDescription:
      "A WordPress site for a health clinic offering non-invasive treatments and physical therapy, with team profiles and WooCommerce.",
    services: ["Web Design", "WordPress Development"],
    tech: ["WordPress", "Elementor", "WooCommerce", "Slider Revolution"],
    image: img(
      "regency-health-and-professionals",
      2,
      "Regency Health and Professionals website",
    ),
    featured: false,
    accent: "#9BE7C4",
    layout: "reverse",
    caseStudy: {
      overview:
        "Regency Health and Professionals presents its clinical team and treatment options. The build uses WordPress with Elementor, WooCommerce and Slider Revolution for the hero.",
      responsibilities: [
        "Design and Elementor implementation",
        "Team and services sections",
        "WooCommerce setup",
      ],
      notes: [
        "Healthcare copy needs calm pacing — generous spacing and a soft palette keep it approachable.",
      ],
    },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: undefined, next: undefined };
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  return { prev, next };
}

/** Facts derived from the dataset — never hand-typed numbers. */
export const projectStats = {
  total: projects.length,
  platforms: Array.from(new Set(projects.map((p) => p.platform))),
  ecommerce: projects.filter((p) =>
    p.tech.some((t) => /WooCommerce|Shopify|Easy Digital/.test(t)),
  ).length,
};

export const pad = (n: number) => String(n).padStart(2, "0");
