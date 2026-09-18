"use client";

export function BackToTop() {
  return (
    <button
      type="button"
      className="label-mono group flex min-h-11 items-center gap-2 text-fg-2 transition-colors hover:text-fg"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      Back to top
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5"
      >
        ↑
      </span>
    </button>
  );
}
