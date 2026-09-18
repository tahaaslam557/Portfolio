import Link from "next/link";
import { site } from "@/data/site";
import { BackToTop } from "./BackToTop";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <div className="container-x label-mono grid grid-cols-2 items-center gap-y-4 py-6 text-fg-3 sm:grid-cols-3">
        <Link
          href="/"
          className="display text-[1.15rem] normal-case tracking-[-0.02em] text-fg"
          aria-label={`${site.name} — home`}
        >
          {site.shortName}
        </Link>
        <span className="hidden text-center sm:block">
          Design / Development / Digital
        </span>
        <span className="flex items-center justify-end gap-4 whitespace-nowrap sm:gap-6">
          <span>© {year}</span>
          <BackToTop />
        </span>
      </div>
    </footer>
  );
}
