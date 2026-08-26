export const BASE_URL =
  "https://international-money-transfer-calculator.vercel.app";

export const RATE_SNAPSHOT_DATE = "2026-08-25";
export const RATE_SOURCE =
  "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html";

export const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$", region: "United States" },
  { code: "GBP", name: "British Pound", symbol: "£", region: "United Kingdom" },
  { code: "EUR", name: "Euro", symbol: "€", region: "Eurozone" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$", region: "Canada" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", region: "Australia" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", region: "Japan" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", region: "Singapore" },
  { code: "CNY", name: "Chinese Yuan", symbol: "CN¥", region: "China" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", region: "India" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", region: "Philippines" },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$", region: "Mexico" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", region: "Brazil" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export const SEND_CURRENCIES: CurrencyCode[] = [
  "USD",
  "GBP",
  "EUR",
  "CAD",
  "AUD",
  "JPY",
  "SGD",
];

export const RECEIVE_CURRENCIES: CurrencyCode[] = [
  "CNY",
  "INR",
  "PHP",
  "MXN",
  "EUR",
  "GBP",
  "JPY",
  "BRL",
  "USD",
];

/**
 * ECB reference rates: units of each currency per 1 EUR.
 * The EUR entry is the cross-rate anchor.
 */
export const ECB_RATES_PER_EUR: Record<CurrencyCode, number> = {
  EUR: 1,
  USD: 1.1662,
  JPY: 185.7,
  GBP: 0.8555,
  AUD: 1.6303,
  BRL: 6.0153,
  CAD: 1.6163,
  CNY: 7.8366,
  INR: 111.276,
  MXN: 19.7632,
  PHP: 71.974,
  SGD: 1.4814,
};

export const COMMON_AMOUNTS = [500, 1000, 2000, 5000, 10000] as const;

export const POPULAR_PAIRS: Array<{
  from: CurrencyCode;
  to: CurrencyCode;
}> = [
  { from: "USD", to: "CNY" },
  { from: "USD", to: "INR" },
  { from: "GBP", to: "EUR" },
  { from: "USD", to: "PHP" },
  { from: "CAD", to: "USD" },
  { from: "AUD", to: "INR" },
  { from: "SGD", to: "CNY" },
  { from: "EUR", to: "BRL" },
  { from: "GBP", to: "INR" },
  { from: "JPY", to: "PHP" },
  { from: "USD", to: "MXN" },
  { from: "AUD", to: "CNY" },
];

type ProviderModel = {
  id: "wise" | "remitly" | "revolut" | "western-union" | "bank-wire";
  name: string;
  shortName: string;
  fixedFeeUsd: number;
  variableFeeRate: number;
  exchangeMarkupRate: number;
  delivery: string;
  channel: string;
  detail: string;
  promotion?: string;
  affiliateUrl?: string;
};

export type TransferEstimate = {
  providerId: ProviderModel["id"];
  provider: string;
  shortName: string;
  recipientGets: number;
  explicitFee: number;
  hiddenMarkup: number;
  totalCost: number;
  effectiveRate: number;
  midMarketRate: number;
  exchangeMarkupRate: number;
  delivery: string;
  channel: string;
  detail: string;
  promotion?: string;
  affiliateUrl?: string;
  savingsVsBankUsd: number;
  savingsVsBankSource: number;
  savingsVsBankRecipient: number;
};

const PROVIDER_MODELS: ProviderModel[] = [
  {
    id: "wise",
    name: "Wise",
    shortName: "WISE",
    fixedFeeUsd: 0.7,
    variableFeeRate: 0.0055,
    exchangeMarkupRate: 0,
    delivery: "Minutes to same day",
    channel: "Local bank rails",
    detail: "Mid-market rate with a transparent fixed + variable fee estimate.",
    affiliateUrl: "https://wise.com/",
  },
  {
    id: "remitly",
    name: "Remitly Economy",
    shortName: "REMITLY",
    fixedFeeUsd: 0,
    variableFeeRate: 0,
    exchangeMarkupRate: 0.0075,
    delivery: "3–5 business days · Express can arrive in minutes",
    channel: "Economy / Express",
    detail:
      "Economy estimate uses a promotional fee waiver; the exchange-rate margin remains visible.",
    promotion: "New-customer fee waiver may apply",
    affiliateUrl: "https://www.remitly.com/",
  },
  {
    id: "revolut",
    name: "Revolut Standard",
    shortName: "REVOLUT",
    fixedFeeUsd: 1.5,
    variableFeeRate: 0,
    exchangeMarkupRate: 0,
    delivery: "Minutes to 1 business day",
    channel: "Bank transfer",
    detail:
      "Weekday estimate within the Standard plan fair-usage allowance; transfer fees vary by route.",
    affiliateUrl: "https://www.revolut.com/",
  },
  {
    id: "western-union",
    name: "Western Union",
    shortName: "WESTERN UNION",
    fixedFeeUsd: 4.99,
    variableFeeRate: 0,
    exchangeMarkupRate: 0.018,
    delivery: "Minutes for cash pickup · Same day to bank",
    channel: "Bank / cash pickup",
    detail:
      "Indicative digital-transfer model; cash pickup and payment method can change the final price.",
    affiliateUrl: "https://www.westernunion.com/",
  },
  {
    id: "bank-wire",
    name: "Traditional Bank Wire",
    shortName: "BANK WIRE",
    fixedFeeUsd: 40,
    variableFeeRate: 0,
    exchangeMarkupRate: 0.03,
    delivery: "1–3 business days",
    channel: "SWIFT wire",
    detail:
      "Benchmark model: $40 wire fee plus a 3% exchange-rate markup, before possible intermediary fees.",
  },
];

export function isCurrencyCode(value: string): value is CurrencyCode {
  return CURRENCIES.some((currency) => currency.code === value);
}

export function getCurrency(code: CurrencyCode) {
  return CURRENCIES.find((currency) => currency.code === code) ?? CURRENCIES[0];
}

export function getExchangeRate(
  from: CurrencyCode,
  to: CurrencyCode,
): number {
  return ECB_RATES_PER_EUR[to] / ECB_RATES_PER_EUR[from];
}

export function formatCurrency(
  value: number,
  currency: CurrencyCode,
  options?: { compact?: boolean },
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: options?.compact ? "compact" : "standard",
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(value);
}

function getSourceValueOfUsd(from: CurrencyCode): number {
  return getExchangeRate("USD", from);
}

function estimateForProvider(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  model: ProviderModel,
): Omit<
  TransferEstimate,
  "savingsVsBankUsd" | "savingsVsBankSource" | "savingsVsBankRecipient"
> {
  const midMarketRate = getExchangeRate(from, to);
  const fixedFee = model.fixedFeeUsd * getSourceValueOfUsd(from);
  const explicitFee = fixedFee + amount * model.variableFeeRate;
  const convertibleAmount = Math.max(0, amount - explicitFee);
  const recipientAtMidMarket = convertibleAmount * midMarketRate;
  const recipientGets =
    recipientAtMidMarket * (1 - model.exchangeMarkupRate);
  const hiddenMarkupRecipient = recipientAtMidMarket - recipientGets;
  const hiddenMarkup = hiddenMarkupRecipient / midMarketRate;
  const totalCost = explicitFee + hiddenMarkup;
  const effectiveRate = amount > 0 ? recipientGets / amount : 0;

  return {
    providerId: model.id,
    provider: model.name,
    shortName: model.shortName,
    recipientGets,
    explicitFee,
    hiddenMarkup,
    totalCost,
    effectiveRate,
    midMarketRate,
    exchangeMarkupRate: model.exchangeMarkupRate,
    delivery: model.delivery,
    channel: model.channel,
    detail: model.detail,
    promotion: model.promotion,
    affiliateUrl: model.affiliateUrl,
  };
}

export function estimateTransfers(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
): TransferEstimate[] {
  const safeAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0;
  const estimates = PROVIDER_MODELS.map((model) =>
    estimateForProvider(safeAmount, from, to, model),
  );
  const bank =
    estimates.find((estimate) => estimate.providerId === "bank-wire") ??
    estimates[estimates.length - 1];
  const sourceToUsd = getExchangeRate(from, "USD");

  return estimates
    .map((estimate) => {
      const savingsVsBankRecipient = Math.max(
        0,
        estimate.recipientGets - bank.recipientGets,
      );
      const savingsVsBankSource =
        savingsVsBankRecipient / estimate.midMarketRate;

      return {
        ...estimate,
        savingsVsBankRecipient,
        savingsVsBankSource,
        savingsVsBankUsd: savingsVsBankSource * sourceToUsd,
      };
    })
    .sort((a, b) => b.recipientGets - a.recipientGets);
}

export function buildComparisonText(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  estimates = estimateTransfers(amount, from, to),
): string {
  const heading =
    "Transfer comparison: " +
    formatCurrency(amount, from) +
    " " +
    from +
    " → " +
    to;
  const lines = estimates.map(
    (estimate, index) =>
      [
        String(index + 1) + ". " + estimate.provider,
        "recipient gets " + formatCurrency(estimate.recipientGets, to),
        "fee " + formatCurrency(estimate.explicitFee, from),
        "hidden FX cost " + formatCurrency(estimate.hiddenMarkup, from),
        "ETA " + estimate.delivery + ".",
      ].join("; "),
  );

  return [
    heading,
    "Indicative mid-market rate: 1 " +
      from +
      " = " +
      getExchangeRate(from, to).toFixed(6) +
      " " +
      to,
    ...lines,
    "ECB reference-rate snapshot: " +
      RATE_SNAPSHOT_DATE +
      ". Estimates are not live quotes.",
  ].join("\n");
}

export function getStaticTransferParams() {
  return SEND_CURRENCIES.flatMap((from) =>
    RECEIVE_CURRENCIES.filter((to) => to !== from).flatMap((to) =>
      COMMON_AMOUNTS.map((amount) => ({
        from,
        to,
        amount: String(amount),
      })),
    ),
  );
}
