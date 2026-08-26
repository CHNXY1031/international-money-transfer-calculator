"use client";

import { useMemo, useState } from "react";

import {
  ArrowDownUp,
  ArrowUpRight,
  Banknote,
  Check,
  Clock3,
  Copy,
  Gauge,
  Landmark,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import {
  buildComparisonText,
  CURRENCIES,
  type CurrencyCode,
  estimateTransfers,
  formatCurrency,
  getExchangeRate,
  RATE_SNAPSHOT_DATE,
} from "@/lib/transferData";
import { cn } from "@/lib/utils";

type TransferCalculatorProps = {
  initialAmount?: number;
  initialFrom?: CurrencyCode;
  initialTo?: CurrencyCode;
  compactHeading?: boolean;
};

export function TransferCalculator({
  initialAmount = 5000,
  initialFrom = "USD",
  initialTo = "CNY",
  compactHeading = false,
}: TransferCalculatorProps) {
  const [amountInput, setAmountInput] = useState(String(initialAmount));
  const [from, setFrom] = useState<CurrencyCode>(initialFrom);
  const [to, setTo] = useState<CurrencyCode>(initialTo);
  const [copied, setCopied] = useState(false);
  const parsedAmount = Number(amountInput.replaceAll(",", ""));
  const amount =
    Number.isFinite(parsedAmount) && parsedAmount >= 0 ? parsedAmount : 0;
  const estimates = useMemo(
    () => estimateTransfers(amount, from, to),
    [amount, from, to],
  );
  const best = estimates[0];
  const bank = estimates.find((item) => item.providerId === "bank-wire");
  const potentialGain = bank
    ? Math.max(0, best.recipientGets - bank.recipientGets)
    : 0;

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleCopy = async () => {
    const comparison = buildComparisonText(amount, from, to, estimates);
    await navigator.clipboard.writeText(comparison);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="calculator" className="scroll-mt-6">
      {!compactHeading && (
        <div className="mb-7 flex flex-col justify-between gap-4 border-l border-signal/50 pl-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Live decision workspace</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
              Compare what really arrives.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-paper/55">
            One amount. Five delivery models. Every fee translated into the
            money your recipient actually receives.
          </p>
        </div>
      )}

      <div className="grid items-start gap-5 xl:grid-cols-12">
        <div className="terminal-border relative overflow-hidden p-5 sm:p-7 xl:col-span-7">
          <div className="absolute right-0 top-0 h-px w-28 bg-signal" />
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Gauge className="size-4 text-signal" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-[0.16em]">
                Transfer inputs
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/35">
              ECB · {RATE_SNAPSHOT_DATE}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1.3fr_1fr_auto_1fr] sm:items-end">
            <label>
              <span className="field-label">You send</span>
              <span className="flex h-14 items-center border border-white/15 bg-ink px-4 focus-within:border-signal">
                <Banknote
                  className="mr-3 size-5 shrink-0 text-signal"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  inputMode="decimal"
                  aria-label="Amount to send"
                  value={amountInput}
                  onChange={(event) =>
                    setAmountInput(event.target.value.replace(/[^\d.,]/g, ""))
                  }
                  className="min-w-0 flex-1 bg-transparent font-mono text-xl font-semibold text-paper outline-none"
                />
              </span>
            </label>

            <label>
              <span className="field-label">From</span>
              <select
                aria-label="Send currency"
                value={from}
                onChange={(event) =>
                  setFrom(event.target.value as CurrencyCode)
                }
                className="h-14 w-full border border-white/15 bg-ink px-4 font-mono text-sm font-semibold outline-none transition-colors focus:border-signal"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} · {currency.name}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap currencies"
              className="grid size-12 place-items-center border border-white/15 text-paper/60 transition-colors hover:border-signal hover:bg-signal/10 hover:text-signal sm:mb-1"
            >
              <ArrowDownUp className="size-5" aria-hidden="true" />
            </button>

            <label>
              <span className="field-label">To</span>
              <select
                aria-label="Receive currency"
                value={to}
                onChange={(event) => setTo(event.target.value as CurrencyCode)}
                className="h-14 w-full border border-white/15 bg-ink px-4 font-mono text-sm font-semibold outline-none transition-colors focus:border-signal"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} · {currency.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 font-mono text-xs">
            <span className="text-paper/45">MID-MARKET CROSS RATE</span>
            <span className="text-paper">
              1 {from} = {getExchangeRate(from, to).toFixed(6)} {to}
            </span>
          </div>
        </div>

        <aside className="relative overflow-hidden border border-signal/30 bg-signal p-6 text-ink xl:col-span-5 xl:translate-y-8">
          <div className="absolute -right-8 -top-8 size-32 rounded-full border-[24px] border-ink/10" />
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]">
            Best modeled outcome
          </p>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-ink/65">
                Recipient can get
              </p>
              <p className="mt-1 font-mono text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                {formatCurrency(best.recipientGets, to)}
              </p>
              <p className="mt-2 text-sm font-semibold">via {best.provider}</p>
            </div>
            <div className="border-l border-ink/20 pl-5">
              <p className="text-sm font-medium text-ink/65">
                More than bank wire
              </p>
              <p className="mt-1 font-mono text-2xl font-semibold">
                +{formatCurrency(potentialGain, to)}
              </p>
              <p className="mt-2 text-xs leading-5 text-ink/65">
                Equivalent to {formatCurrency(best.savingsVsBankUsd, "USD")} in
                modeled savings.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-12 flex flex-col justify-between gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Ranked by recipient amount</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
            Provider comparison
          </h3>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/15 px-4 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors hover:border-signal hover:text-signal"
        >
          {copied ? (
            <Check className="size-4 text-signal" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )}
          {copied ? "Copied comparison" : "📋 Copy Rate Comparison"}
        </button>
      </div>

      <div className="mt-4 space-y-3" aria-live="polite">
        {estimates.map((estimate, index) => {
          const isBest = index === 0;
          const isBank = estimate.providerId === "bank-wire";

          return (
            <article
              key={estimate.providerId}
              className={cn(
                "group relative grid gap-5 border bg-panel/75 p-5 transition-colors sm:p-6 lg:grid-cols-[52px_1.2fr_1fr_1fr] lg:items-center",
                isBest
                  ? "border-signal/70 bg-signal/[0.07] lg:-translate-x-2"
                  : "border-white/10 hover:border-white/25",
              )}
            >
              <div
                className={cn(
                  "grid size-11 place-items-center border font-mono text-sm font-semibold",
                  isBest
                    ? "border-signal bg-signal text-ink"
                    : "border-white/15 text-paper/45",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-lg font-semibold tracking-[-0.03em]">
                    {estimate.provider}
                  </h4>
                  {isBest && (
                    <span className="inline-flex items-center gap-1 bg-signal px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ink">
                      <Sparkles className="size-3" aria-hidden="true" />
                      Highest arrival
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm leading-5 text-paper/48">
                  {estimate.detail}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/45">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-3.5" aria-hidden="true" />
                    {estimate.delivery}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5" aria-hidden="true" />
                    {estimate.channel}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-y border-white/10 py-4 lg:border-y-0 lg:border-l lg:py-1 lg:pl-6">
                <div>
                  <p className="field-label">Visible fee</p>
                  <p className="font-mono text-sm font-semibold">
                    {formatCurrency(estimate.explicitFee, from)}
                  </p>
                </div>
                <div>
                  <p className="field-label">Hidden FX cost</p>
                  <p
                    className={cn(
                      "font-mono text-sm font-semibold",
                      estimate.hiddenMarkup > 0 && "text-amber",
                    )}
                  >
                    {formatCurrency(estimate.hiddenMarkup, from)}
                  </p>
                </div>
                <div>
                  <p className="field-label">Effective rate</p>
                  <p className="font-mono text-xs">
                    {estimate.effectiveRate.toFixed(6)}
                  </p>
                </div>
                <div>
                  <p className="field-label">FX markup</p>
                  <p className="font-mono text-xs">
                    {(estimate.exchangeMarkupRate * 100).toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="lg:text-right">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">
                  Recipient gets
                </p>
                <p
                  className={cn(
                    "mt-1 font-mono text-2xl font-semibold tracking-[-0.05em]",
                    isBest && "text-signal",
                  )}
                >
                  {formatCurrency(estimate.recipientGets, to)}
                </p>
                {!isBank && (
                  <p className="mt-2 font-mono text-xs font-semibold text-signal">
                    You save {formatCurrency(estimate.savingsVsBankUsd, "USD")}{" "}
                    vs. traditional banks
                  </p>
                )}

                {estimate.affiliateUrl ? (
                  <a
                    href={estimate.affiliateUrl}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className={cn(
                      "mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 px-4 text-center text-[11px] font-semibold transition-colors lg:w-auto",
                      isBest
                        ? "bg-signal text-ink hover:bg-white"
                        : "border border-white/15 hover:border-signal hover:text-signal",
                    )}
                  >
                    <Zap className="size-4" aria-hidden="true" />
                    🚀 Transfer with {estimate.shortName} (Get Free Transfer)
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="mt-4 inline-flex items-center gap-2 border border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/35">
                    <Landmark className="size-3.5" aria-hidden="true" />
                    Benchmark only
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4 border border-amber/25 bg-amber/[0.06] p-5 text-sm text-paper/60 md:grid-cols-[auto_1fr]">
        <ReceiptText className="size-5 text-amber" aria-hidden="true" />
        <p className="leading-6">
          <strong className="text-paper">Estimate, not a live quote.</strong>{" "}
          Models use the ECB {RATE_SNAPSHOT_DATE} reference-rate snapshot.
          Actual provider prices depend on sending country, recipient route,
          payment method, plan limits, first-transfer eligibility and market
          movement. Intermediary bank fees may also apply.
        </p>
      </div>
    </section>
  );
}
