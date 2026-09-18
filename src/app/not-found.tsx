import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80svh] flex-col justify-end pb-16 pt-40">
      <div className="label-mono text-fg-3">
        <span className="text-accent">404</span> · Not found
      </div>
      <h1 className="display mt-6 text-[length:var(--step-5)]">
        Nothing <span className="outline-text">here</span>.
      </h1>
      <p className="mt-6 max-w-md text-fg-2">
        The page you were after has moved or never existed. The work is one link
        away.
      </p>
      <div className="mt-8 flex gap-3">
        <MagneticButton href="/">Back home</MagneticButton>
        <Link
          href="/#work"
          className="label-mono link-draw self-center text-fg-2 hover:text-fg"
        >
          Selected work →
        </Link>
      </div>
    </section>
  );
}
