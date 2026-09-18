import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { IntroProvider } from "@/components/intro/IntroProvider";
import { IntroLoader } from "@/components/intro/IntroLoader";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SiteNav } from "@/components/navigation/SiteNav";
import { Footer } from "@/components/footer/Footer";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07090f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Runs before paint: repeat visitors (same session) or reduced-motion users
 * skip the intro entirely, with no flash of the overlay.
 */
const introGate = `(function(){try{var d=document.documentElement;var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;var seen=sessionStorage.getItem('ta-intro')==='1';d.dataset.intro=(rm||seen)?'done':'pending';}catch(e){document.documentElement.dataset.intro='done'}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
      data-intro="pending"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Must run synchronously before the loader below is parsed — a raw
            inline script, not next/script (whose queue runs after bootstrap). */}
        <script dangerouslySetInnerHTML={{ __html: introGate }} />
        <IntroProvider>
          <a
            href="#main"
            className="label-mono fixed left-4 top-4 z-[100] -translate-y-24 rounded-sm bg-accent px-3 py-2 text-accent-ink transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <IntroLoader />
          <ScrollProgress />
          <SiteNav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CustomCursor />
          <div aria-hidden="true" className="grain" />
        </IntroProvider>
      </body>
    </html>
  );
}
