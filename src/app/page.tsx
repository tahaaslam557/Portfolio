import { getProjectsWithMedia, toFragment } from "@/lib/media";
import { Hero } from "@/components/hero/Hero";
import { ProjectIndex } from "@/components/work/ProjectIndex";
import { Capabilities } from "@/components/capabilities/Capabilities";
import { TechStack } from "@/components/stack/TechStack";
import { AboutSection } from "@/components/about/AboutSection";
import { ProcessTimeline } from "@/components/process/ProcessTimeline";
import { ProofStrip } from "@/components/proof/ProofStrip";
import { ContactSection } from "@/components/contact/ContactSection";

export default function Home() {
  const projects = getProjectsWithMedia();
  const fragments = projects
    .filter((p) => p.featured)
    .slice(0, 3)
    .map(toFragment);
  const previews = projects.map(toFragment);

  return (
    <>
      <Hero fragments={fragments} />
      <ProjectIndex projects={projects} />
      <Capabilities projects={previews} />
      <TechStack />
      <AboutSection />
      <ProcessTimeline />
      <ProofStrip />
      <ContactSection />
    </>
  );
}
