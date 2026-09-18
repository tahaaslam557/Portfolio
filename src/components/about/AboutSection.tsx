import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollWords } from "./ScrollWords";

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="ambient-soft scroll-mt-20 border-t border-line"
    >
      <div className="container-x pt-[var(--section)] pb-[calc(var(--section)/3)]">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <SectionHeading
              index="03"
              label="About"
              title={["The person", "behind", "the pixels."]}
              id="about-title"
            />
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:pt-12">
            <Reveal>
              <p className="text-[length:var(--step-1)] leading-snug text-fg">
                I design and build websites where visual direction and
                implementation work as one system.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-fg-2">
                Most of my work sits at the point where design decisions become
                code: layouts that hold up on real devices, type that sets the
                tone, motion that explains rather than decorates. I build on
                WordPress and Shopify when a client needs to own and edit their
                site, and in React and Next.js when the interface calls for it.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-4 text-fg-2">
                Whatever the platform, the standard is the same — fast,
                responsive, accessible, and finished to the last detail.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <dl className="label-mono mt-10 grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 text-fg-3">
                <dt>Focus</dt>
                <dd className="text-fg-2">Design + Frontend</dd>
                <dt>Platforms</dt>
                <dd className="text-fg-2">WordPress · Shopify · Next.js</dd>
                <dt>Availability</dt>
                <dd className="text-fg-2">Select projects · Remote</dd>
              </dl>
            </Reveal>
          </div>
        </div>
      </div>

      <ScrollWords />
    </section>
  );
}
