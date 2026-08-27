import type { Metadata } from "next";
import { IBM_Plex_Mono, Sora } from "next/font/google";
import Link from "next/link";

import "./globals.css";

import { ArrowUpRight, Globe2 } from "lucide-react";

import { BASE_URL } from "@/lib/transferData";
import { cn } from "@/lib/utils";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Borderless Rate — International Money Transfer Calculator",
    template: "%s | Borderless Rate",
  },
  description:
    "Compare international money transfer fees, hidden exchange-rate markups, recipient amounts and delivery speed across Wise, Remitly, Revolut, Western Union and bank wires.",
  applicationName: "Borderless Rate",
  keywords: [
    "international money transfer calculator",
    "remittance fee comparison",
    "send money abroad",
    "Wise vs Remitly",
    "bank wire fees",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "Borderless Rate — See What Really Arrives",
    description:
      "Compare fees, FX markups and recipient amounts before you send money internationally.",
    siteName: "Borderless Rate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Borderless Rate — International Transfer Comparison",
    description:
      "A transparent calculator for international transfer fees and recipient amounts.",
  },
  verification: { google: "google4bf79fc737f0ba77" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          sora.variable,
          ibmPlexMono.variable,
          "min-h-screen bg-ink font-sans text-paper antialiased",
        )}
      >
        <header className="border-b border-white/10 bg-ink/90 backdrop-blur-xl">
          <div className="page-shell flex h-20 items-center justify-between">
            <Link
              href="/"
              className="group flex items-center gap-3"
              aria-label="Borderless Rate home"
            >
              <span className="grid size-10 place-items-center border border-signal/60 bg-signal/10 text-signal transition-transform group-hover:-rotate-6">
                <Globe2 className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold tracking-[-0.02em]">
                  BORDERLESS RATE
                </span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.24em] text-paper/45">
                  FX intelligence desk
                </span>
              </span>
            </Link>
            <a
              href="#calculator"
              className="hidden items-center gap-2 border-b border-signal pb-1 font-mono text-xs uppercase tracking-[0.16em] text-signal transition-colors hover:text-white sm:flex"
            >
              Compare now
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </header>
        {children}
        <footer className="border-t border-white/10 bg-[#050c0a]">
          <div className="page-shell grid gap-6 py-10 text-sm text-paper/55 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="font-semibold text-paper">Borderless Rate</p>
              <p className="mt-2 max-w-2xl leading-6">
                Independent indicative comparison only. Provider availability,
                fees and delivery times vary by route, funding method and
                customer eligibility. Always confirm the final quote before
                sending.
              </p>
            </div>
            <div className="font-mono text-xs uppercase tracking-[0.16em] md:text-right">
              <p>ECB snapshot · 25 AUG 2026</p>
              <a href="https://uptime-pulse-saas.vercel.app/?utm_source=international-money-transfer-calculator&amp;utm_medium=referral&amp;utm_campaign=protected_by" target="_blank" rel="noopener noreferrer" className="mt-3 block text-[9px] normal-case tracking-normal text-paper/35 underline decoration-white/10 underline-offset-4 transition hover:text-mint">Protected by UptimePulse — Free Website &amp; SSL Monitor</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
