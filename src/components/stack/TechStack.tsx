import { techStack } from "@/data/site";
import { Marquee } from "@/components/ui/Marquee";

/**
 * Two opposing typographic rows. Hover pauses; reduced motion lays the list
 * out statically. No percentages, no bars — just what is actually used.
 */
export function TechStack() {
  const rowA = techStack.filter((_, i) => i % 2 === 0);
  const rowB = techStack.filter((_, i) => i % 2 === 1);

  return (
    <section
      aria-label="Technology stack"
      className="overflow-hidden border-t border-line py-14 sm:py-20"
    >
      <div className="container-x label-mono mb-8 flex items-center justify-between text-fg-3">
        <span>
          <span className="text-accent">Stack</span> · in daily use
        </span>
        <span>{techStack.length} tools</span>
      </div>
      <Marquee duration={55} className="border-y border-line py-3 sm:py-5">
        {rowA.map((t) => (
          <Item key={t} label={t} />
        ))}
      </Marquee>
      <Marquee
        duration={65}
        reverse
        className="border-b border-line py-3 sm:py-5"
      >
        {rowB.map((t) => (
          <Item key={t} label={t} outline />
        ))}
      </Marquee>
    </section>
  );
}

function Item({ label, outline }: { label: string; outline?: boolean }) {
  return (
    <span className="flex items-center">
      <span
        className={`display whitespace-nowrap px-4 text-[length:var(--step-3)] sm:px-8 ${outline ? "text-accent" : ""}`}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className={`h-2 w-2 rounded-full ${outline ? "bg-fg" : "bg-accent"}`}
      />
    </span>
  );
}
