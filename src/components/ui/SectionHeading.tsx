import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

type Props = {
  index: string;
  label: string;
  title: string | string[];
  className?: string;
  size?: "md" | "lg";
  id?: string;
};

/** Editorial section header: mono index/label row + oversized display title. */
export function SectionHeading({
  index,
  label,
  title,
  className,
  size = "lg",
  id,
}: Props) {
  const lines = Array.isArray(title) ? title : [title];
  return (
    <header className={cn("grid gap-6", className)}>
      <div className="label-mono flex items-center gap-4 text-fg-3">
        <span className="text-accent">{index}</span>
        <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <h2
        id={id}
        className={cn(
          "display",
          size === "lg"
            ? "text-[length:var(--step-4)]"
            : "text-[length:var(--step-3)]",
        )}
      >
        {lines.map((line, i) => (
          <Reveal key={line} mode="clip" delay={i * 0.08} as="span">
            {line}
          </Reveal>
        ))}
      </h2>
    </header>
  );
}
