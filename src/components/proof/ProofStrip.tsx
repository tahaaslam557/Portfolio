import { projectStats } from "@/data/projects";
import { Reveal } from "@/components/ui/Reveal";
import { pad } from "@/lib/utils";

/**
 * Facts only — every number is computed from the project dataset.
 * No testimonials, no invented metrics.
 */
export function ProofStrip() {
  const facts = [
    { value: pad(projectStats.total), label: "Projects in this portfolio" },
    { value: pad(projectStats.total), label: "Live sites, linked" },
    {
      value: pad(projectStats.platforms.length),
      label: "Platforms — " + projectStats.platforms.join(", "),
    },
    { value: pad(projectStats.ecommerce), label: "E-commerce builds" },
  ];

  return (
    <section aria-label="Portfolio facts" className="border-t border-line">
      <div className="container-x">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal
              key={f.label}
              delay={i * 0.06}
              className="border-b border-line py-8 sm:py-10 lg:border-b-0 lg:border-r lg:pr-8 lg:last:border-r-0 [&:nth-child(odd)]:pr-6 lg:[&:nth-child(n+2)]:pl-8"
            >
              <dt className="label-mono text-fg-3">{f.label}</dt>
              <dd className="display mt-3 text-[length:var(--step-4)] text-accent">
                {f.value}
                <span className="text-fg">.</span>
              </dd>
            </Reveal>
          ))}
        </dl>
        <p className="label-mono border-t border-line py-4 text-fg-3">
          Design + development on every project. Counts are derived from the
          project list, not estimated.
        </p>
      </div>
    </section>
  );
}
