import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
};

/**
 * CSS-driven marquee. Content is duplicated once for a seamless loop; the
 * duplicate is aria-hidden and dropped under reduced motion (see globals.css).
 */
export function Marquee({
  children,
  duration = 40,
  reverse,
  className,
}: Props) {
  const style = {
    "--marquee-duration": `${duration}s`,
    "--marquee-direction": reverse ? "reverse" : "normal",
  } as CSSProperties;

  return (
    <div className={cn("marquee overflow-hidden", className)}>
      <div className="marquee-track" style={style}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
