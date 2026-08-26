import Link from "next/link";

import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="page-shell grid min-h-[68vh] content-center py-20">
      <SearchX className="size-8 text-signal" aria-hidden="true" />
      <p className="eyebrow mt-8">Route unavailable</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-[-0.06em]">
        This transfer corridor was not found.
      </h1>
      <p className="mt-5 max-w-xl leading-7 text-paper/55">
        Check the currency codes and amount, or return to the calculator to
        build a supported comparison.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex w-fit items-center gap-2 border border-signal px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-signal hover:bg-signal hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to calculator
      </Link>
    </main>
  );
}
