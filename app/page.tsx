import Link from "next/link";

import {
  ArrowDownRight,
  ArrowRight,
  BadgeDollarSign,
  CircleDollarSign,
  Clock4,
  Globe2,
  ShieldCheck,
} from "lucide-react";

import { TransferCalculator } from "@/components/TransferCalculator";
import { POPULAR_PAIRS } from "@/lib/transferData";

const signals = [
  {
    icon: BadgeDollarSign,
    value: "5",
    label: "pricing models compared",
  },
  {
    icon: Clock4,
    value: "<60s",
    label: "to inspect the real cost",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "fees shown in one view",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="page-shell relative overflow-hidden pb-16 pt-16 sm:pt-24 lg:pb-24">
        <div className="pointer-events-none absolute right-8 top-7 hidden font-mono text-[11rem] font-semibold leading-none text-white/[0.025] xl:block">
          FX
        </div>
        <div className="grid items-end gap-12 lg:grid-cols-12">
          <div className="scan-in lg:col-span-8">
            <p className="eyebrow">International remittance intelligence</p>
            <h1 className="mt-6 max-w-5xl text-[clamp(3rem,7vw,7.4rem)] font-semibold leading-[0.88] tracking-[-0.075em]">
              Send money.
              <span className="block text-signal">Not hidden fees.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-7 text-paper/60 sm:text-lg">
              Compare international transfer fees, exchange-rate markups and
              recipient amounts across leading remittance providers before you
              move a single dollar.
            </p>
          </div>

          <div className="scan-in scan-in-delay relative border-l border-white/15 pl-6 lg:col-span-4 lg:mb-2">
            <ArrowDownRight
              className="absolute -left-3 -top-10 size-6 text-signal"
              aria-hidden="true"
            />
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-paper/40">
              Built for
            </p>
            <ul className="mt-5 space-y-3 text-lg font-medium">
              <li>Overseas families</li>
              <li>International students</li>
              <li>Cross-border workers</li>
              <li>Global freelancers</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 grid border-y border-white/10 sm:grid-cols-3">
          {signals.map(({ icon: Icon, value, label }, index) => (
            <div
              key={label}
              className="flex items-center gap-4 border-white/10 py-5 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0"
            >
              <Icon className="size-5 text-signal" aria-hidden="true" />
              <div>
                <p className="font-mono text-lg font-semibold">{value}</p>
                <p className="text-xs text-paper/45">{label}</p>
              </div>
              <span className="ml-auto font-mono text-[10px] text-paper/20">
                0{index + 1}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell pb-24">
        <TransferCalculator />
      </section>

      <section className="border-y border-white/10 bg-[#091512] py-20">
        <div className="page-shell">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-5">
              <p className="eyebrow">Popular corridors</p>
              <h2 className="mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-5xl">
                Start with the route you actually send.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-paper/55 lg:col-span-5 lg:col-start-8">
              Explore pre-calculated guides for common transfer sizes. Each
              route includes a fee breakdown, traditional-bank benchmark and
              provider ranking.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_PAIRS.map((pair, index) => (
              <Link
                key={[pair.from, pair.to].join("-")}
                href={
                  "/transfer/" + pair.from + "-to-" + pair.to + "/5000"
                }
                className="group relative min-h-40 border border-white/10 p-5 transition-colors hover:z-10 hover:border-signal hover:bg-signal/[0.04] sm:-mr-px sm:-mt-px"
              >
                <span className="font-mono text-[10px] text-paper/30">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="mt-8 flex items-end justify-between">
                  <div>
                    <p className="font-mono text-2xl font-semibold tracking-[-0.04em]">
                      {pair.from}
                      <span className="mx-2 text-signal">→</span>
                      {pair.to}
                    </p>
                    <p className="mt-2 text-xs text-paper/45">
                      Compare a 5,000 {pair.from} transfer
                    </p>
                  </div>
                  <ArrowRight
                    className="size-5 text-paper/25 transition-transform group-hover:translate-x-1 group-hover:text-signal"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border border-signal/30 bg-signal p-7 text-ink">
            <Globe2 className="size-7" aria-hidden="true" />
            <p className="mt-16 font-mono text-xs font-semibold uppercase tracking-[0.18em]">
              The benchmark
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.045em]">
              Mid-market first. Every cost after.
            </p>
          </div>
          <div className="terminal-border p-7 sm:p-10">
            <div className="flex items-start gap-4">
              <CircleDollarSign
                className="mt-1 size-6 shrink-0 text-signal"
                aria-hidden="true"
              />
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.04em]">
                  Why “zero fee” can still cost more
                </h2>
                <p className="mt-4 max-w-3xl leading-7 text-paper/55">
                  A transfer provider can advertise no upfront fee while
                  returning less money through a marked-up exchange rate. This
                  calculator converts both the visible fee and the hidden
                  currency spread into the sending currency, then ranks each
                  option by the amount arriving—not the marketing headline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
