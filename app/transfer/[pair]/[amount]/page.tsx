import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CircleHelp,
  Landmark,
  ReceiptText,
} from "lucide-react";

import { TransferCalculator } from "@/components/TransferCalculator";
import {
  BASE_URL,
  COMMON_AMOUNTS,
  estimateTransfers,
  formatCurrency,
  getCurrency,
  getStaticTransferParams,
  isCurrencyCode,
  RATE_SNAPSHOT_DATE,
  type CurrencyCode,
} from "@/lib/transferData";

type TransferPageParams = {
  pair: string;
  amount: string;
};

type TransferPageProps = {
  params: TransferPageParams;
};

function parseRoute(params: TransferPageParams) {
  const pairMatch = /^([A-Z]{3})-to-([A-Z]{3})$/i.exec(params.pair);
  if (!pairMatch) {
    return null;
  }

  const from = pairMatch[1].toUpperCase();
  const to = pairMatch[2].toUpperCase();
  const amount = Number(params.amount);

  if (
    !isCurrencyCode(from) ||
    !isCurrencyCode(to) ||
    from === to ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > 10_000_000
  ) {
    return null;
  }

  return { from, to, amount };
}

function formatTitleAmount(amount: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateStaticParams() {
  return getStaticTransferParams().map(({ from, to, amount }) => ({
    pair: from + "-to-" + to,
    amount,
  }));
}

export function generateMetadata({ params }: TransferPageProps): Metadata {
  const route = parseRoute(params);

  if (!route) {
    return {
      title: "Transfer comparison not found",
      robots: { index: false, follow: false },
    };
  }

  const amountLabel = formatTitleAmount(route.amount, route.from);
  const title =
    "Cheapest Way to Send " +
    amountLabel +
    " from " +
    route.from +
    " to " +
    route.to +
    " (2026 Fee Comparison)";
  const description =
    "Compare the recipient amount, transfer fee, hidden exchange-rate markup and delivery speed for sending " +
    amountLabel +
    " from " +
    route.from +
    " to " +
    route.to +
    " with Wise, Remitly, Revolut, Western Union and bank wire.";
  const path =
    "/transfer/" +
    route.from +
    "-to-" +
    route.to +
    "/" +
    route.amount;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function TransferRoutePage({ params }: TransferPageProps) {
  const route = parseRoute(params);

  if (!route) {
    notFound();
  }

  const { from, to, amount } = route;
  const fromCurrency = getCurrency(from);
  const toCurrency = getCurrency(to);
  const estimates = estimateTransfers(amount, from, to);
  const best = estimates[0];
  const bank = estimates.find((item) => item.providerId === "bank-wire");
  const amountLabel = formatTitleAmount(amount, from);
  const canonicalPath =
    "/transfer/" + from + "-to-" + to + "/" + String(amount);

  const faqItems = [
    {
      question:
        "What is the cheapest way to send " +
        amountLabel +
        " from " +
        from +
        " to " +
        to +
        "?",
      answer:
        "Under this indicative " +
        RATE_SNAPSHOT_DATE +
        " model, " +
        best.provider +
        " delivers the highest recipient amount at approximately " +
        formatCurrency(best.recipientGets, to) +
        ". Final quotes can change by payment method, location and market movement.",
    },
    {
      question: "How much can I save versus a traditional bank wire?",
      answer: bank
        ? "The top modeled provider saves about " +
          formatCurrency(best.savingsVsBankUsd, "USD") +
          " compared with a bank benchmark using a $40 wire fee and 3% exchange-rate markup."
        : "Savings depend on the final provider quote and any intermediary fees.",
    },
    {
      question: "Why is the exchange-rate markup important?",
      answer:
        "A provider can advertise a low or zero transfer fee while embedding its cost in a weaker exchange rate. The recipient amount captures both visible fees and that hidden spread.",
    },
    {
      question:
        "How long does a " + from + " to " + to + " transfer take?",
      answer:
        "Digital providers can deliver in minutes or on the same day on eligible routes. Economy and SWIFT transfers can take one to five business days. Compliance checks and bank holidays may add time.",
    },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name:
        from + " to " + to + " International Money Transfer Calculator",
      url: BASE_URL + canonicalPath,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      description:
        "Compare estimated fees and recipient amounts when sending " +
        amountLabel +
        " from " +
        from +
        " to " +
        to +
        ".",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Recipient amount comparison",
        "Hidden exchange-rate markup breakdown",
        "Transfer fee estimate",
        "Delivery time comparison",
        "Traditional bank wire savings benchmark",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="page-shell pb-12 pt-10 sm:pb-16 sm:pt-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-paper/45 transition-colors hover:text-signal"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          All transfer routes
        </Link>

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow">
              {fromCurrency.region} → {toCurrency.region}
            </p>
            <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-[0.96] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              Cheapest way to send{" "}
              <span className="text-signal">{amountLabel}</span> from {from} to{" "}
              {to}
            </h1>
          </div>
          <div className="border-l border-white/15 pl-5 lg:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/40">
              2026 fee comparison
            </p>
            <p className="mt-3 text-sm leading-6 text-paper/58">
              Compare {fromCurrency.name} to {toCurrency.name} transfer costs
              with every modeled fee exposed.
            </p>
          </div>
        </div>
      </section>

      <section className="page-shell pb-24">
        <TransferCalculator
          initialAmount={amount}
          initialFrom={from}
          initialTo={to}
          compactHeading
        />
      </section>

      <section className="border-y border-white/10 bg-[#091512] py-20">
        <div className="page-shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Route guide</p>
            <h2 className="mt-4 text-4xl font-semibold leading-[1] tracking-[-0.05em]">
              How to keep more of your {from} transfer.
            </h2>
          </div>

          <div className="grid gap-px bg-white/10 sm:grid-cols-3 lg:col-span-8">
            <article className="bg-[#091512] p-6">
              <BadgeCheck className="size-5 text-signal" aria-hidden="true" />
              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/35">
                Step 01
              </p>
              <h3 className="mt-2 font-semibold">Compare arrival, not fee</h3>
              <p className="mt-3 text-sm leading-6 text-paper/50">
                Rank quotes by final {to} received so an exchange-rate spread
                cannot hide behind a “zero fee” headline.
              </p>
            </article>
            <article className="bg-[#091512] p-6">
              <ReceiptText className="size-5 text-signal" aria-hidden="true" />
              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/35">
                Step 02
              </p>
              <h3 className="mt-2 font-semibold">Match the funding method</h3>
              <p className="mt-3 text-sm leading-6 text-paper/50">
                Bank account funding is often cheaper than a card. Compare like
                with like before choosing speed over cost.
              </p>
            </article>
            <article className="bg-[#091512] p-6">
              <Landmark className="size-5 text-signal" aria-hidden="true" />
              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/35">
                Step 03
              </p>
              <h3 className="mt-2 font-semibold">Check the final quote</h3>
              <p className="mt-3 text-sm leading-6 text-paper/50">
                Confirm limits, promotions and intermediary fees on the
                provider checkout screen before authorizing your transfer.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="page-shell py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <CircleHelp className="size-5 text-signal" aria-hidden="true" />
              <p className="eyebrow">Frequently asked</p>
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em]">
              {from} to {to} transfer questions
            </h2>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10 lg:col-span-8">
            {faqItems.map((item, index) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start gap-4">
                  <span className="mt-1 font-mono text-[10px] text-signal">
                    0{index + 1}
                  </span>
                  <span className="flex-1 font-semibold">{item.question}</span>
                  <ArrowRight
                    className="mt-0.5 size-4 shrink-0 text-paper/35 transition-transform group-open:rotate-90 group-open:text-signal"
                    aria-hidden="true"
                  />
                </summary>
                <p className="ml-10 mt-3 max-w-3xl text-sm leading-6 text-paper/55">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <p className="field-label">Compare another amount</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_AMOUNTS.map((commonAmount) => (
              <Link
                key={commonAmount}
                href={
                  "/transfer/" +
                  from +
                  "-to-" +
                  to +
                  "/" +
                  commonAmount
                }
                className="border border-white/10 px-4 py-3 font-mono text-xs transition-colors hover:border-signal hover:text-signal"
              >
                {formatTitleAmount(commonAmount, from)}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
