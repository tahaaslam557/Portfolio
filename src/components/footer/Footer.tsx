import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { navLinks, phones, site, socials } from "@/data/site";
import {
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";
import { BackToTop } from "./BackToTop";
import { Signature } from "./Signature";

type Social = {
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  external?: boolean;
};

const socialIcons: Record<string, Social["Icon"]> = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
};

function buildSocials(): Social[] {
  const list: Social[] = socials
    .filter((s) => s.href && socialIcons[s.label])
    .map((s) => ({ ...s, Icon: socialIcons[s.label], external: true }));
  const wa = phones[0];
  const call = phones.find((p) => p.call);
  if (wa)
    list.push({
      label: "WhatsApp",
      href: `https://wa.me/${wa.digits}`,
      Icon: WhatsAppIcon,
      external: true,
    });
  list.push({ label: "Email", href: `mailto:${site.email}`, Icon: MailIcon });
  if (call)
    list.push({ label: "Call", href: `tel:+${call.digits}`, Icon: PhoneIcon });
  return list;
}

export function Footer() {
  const year = new Date().getFullYear();
  const links = buildSocials();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="container-x relative pb-8 pt-16 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="label-mono text-fg-3">Designed &amp; built by</p>
            <Link
              href="/"
              aria-label={`${site.name} — home`}
              className="-ml-[0.12em] mt-2 block w-fit text-accent transition-opacity hover:opacity-85"
            >
              <Signature
                name={site.name}
                className="-mb-[0.3em] text-[length:clamp(3.6rem,11vw,9.5rem)]"
              />
            </Link>
            <p className="mt-2 max-w-sm text-fg-2">
              {site.role}. {site.tagline}
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5">
            <nav aria-label="Footer">
              <p className="label-mono text-fg-3">Navigate</p>
              <ul className="mt-4 grid gap-2">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={`/${l.href}`}
                      className="link-draw text-fg-2 hover:text-fg"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <p className="label-mono text-fg-3">Get in touch</p>
              <ul className="mt-4 grid gap-3 text-fg-2">
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="link-draw break-all hover:text-fg"
                  >
                    {site.email}
                  </a>
                </li>
                {phones.map((p) => (
                  <li key={p.digits} className="flex flex-col">
                    <a
                      href={
                        p.call ? `tel:+${p.digits}` : `https://wa.me/${p.digits}`
                      }
                      {...(p.call
                        ? {}
                        : { target: "_blank", rel: "noopener noreferrer" })}
                      className="link-draw w-fit hover:text-fg"
                    >
                      {p.display}
                    </a>
                    <span className="label-mono mt-0.5 text-[0.68rem] text-fg-3">
                      {p.call ? "Call · WhatsApp" : "WhatsApp"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <ul className="mt-14 flex flex-wrap gap-3" aria-label="Social links">
          {links.map(({ label, href, Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                title={label}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="grid size-12 place-items-center rounded-full border border-line-strong text-fg-2 transition-[color,background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-accent-ink focus-visible:border-accent focus-visible:text-fg"
              >
                <Icon />
              </a>
            </li>
          ))}
        </ul>

        <div className="label-mono mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-fg-3">
          <span>
            © {year} {site.name}. All rights reserved.
          </span>
          <span className="hidden sm:block">{site.location}</span>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
