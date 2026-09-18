import Image from "next/image";
import { cn, pad } from "@/lib/utils";

type Props = {
  src: string | null;
  alt: string;
  title: string;
  index: number;
  accent: string;
  category?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Aspect ratio class, e.g. "aspect-[16/10]" */
  ratio?: string;
  /** Show a browser-chrome frame around the media */
  framed?: boolean;
};

/**
 * Renders a real screenshot when one exists, otherwise a designed placeholder
 * that is clearly a placeholder — never something that imitates a screenshot.
 */
export function ProjectMedia({
  src,
  alt,
  title,
  index,
  accent,
  category,
  priority,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  className,
  ratio = "aspect-[16/10]",
  framed = true,
}: Props) {
  return (
    <div
      className={cn(
        "@container relative overflow-hidden rounded-md bg-surface",
        ratio,
        className,
      )}
      style={{ "--accent": accent } as React.CSSProperties}
    >
      {framed && (
        <div className="absolute inset-x-0 top-0 z-10 flex h-8 items-center gap-1.5 border-b border-line bg-surface-2/90 px-3 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="label-mono ml-3 truncate text-[0.6rem] text-fg-3">
            {title}
          </span>
        </div>
      )}

      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover object-top", framed && "pt-8")}
        />
      ) : (
        <div
          className={cn(
            "absolute inset-0 flex flex-col justify-between p-[5cqw]",
            framed && "pt-[max(2.5rem,5cqw)]",
          )}
        >
          {/* Accent wash, kept quiet */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.18]"
            style={{
              background: `radial-gradient(60% 80% at 80% 20%, var(--accent), transparent 70%)`,
            }}
          />
          <div className="relative flex items-start justify-between">
            <span className="label-mono text-[max(0.5rem,2.2cqw)] text-fg-3">
              {category ?? "Project"}
            </span>
            <span className="label-mono text-[max(0.5rem,2.2cqw)] text-fg-3">
              Preview pending
            </span>
          </div>
          <div className="relative">
            <span className="display outline-text block text-[30cqw] leading-none opacity-70">
              {pad(index)}
            </span>
            <span className="label-mono mt-2 block text-[max(0.5rem,2.4cqw)] text-fg-2">
              {title}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
