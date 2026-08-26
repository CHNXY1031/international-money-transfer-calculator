# Borderless Rate

A production-ready international money transfer and remittance comparison
calculator built with Next.js 14, TypeScript and Tailwind CSS.

## What it compares

- Recipient amount, ranked from highest to lowest
- Visible transfer fees
- Hidden exchange-rate markup
- Effective exchange rate
- Estimated delivery time
- Savings versus a traditional bank-wire benchmark

The calculator includes indicative models for Wise, Remitly Economy, Revolut
Standard, Western Union and a traditional SWIFT bank wire.

## Rate methodology

Cross rates are derived from the European Central Bank reference-rate snapshot
dated **2026-08-25**. Provider fee models are transparent estimates, not live
quotes. Actual pricing varies by route, funding method, customer location,
provider plan, promotion eligibility and market conditions.

- Wise: estimated fixed + variable fee, mid-market FX
- Remitly: modeled new-customer Economy fee waiver + visible FX margin
- Revolut: modeled weekday exchange within Standard fair-usage allowance
- Western Union: indicative digital-transfer fee + FX margin
- Traditional bank wire: $40 fixed fee + 3% FX markup benchmark

Always confirm the final provider quote before sending money.

## Local development

~~~bash
npm install
npm run dev
~~~

Open http://localhost:3000.

## Verification

~~~bash
npm run typecheck
npm run lint
npm test
npm run build
~~~

The production build statically pre-renders 295 transfer comparison pages
across supported send currencies, receive currencies and five common amounts.

## SEO

- Fixed production origin:
  https://international-money-transfer-calculator.vercel.app
- Dynamic metadata and canonical URLs
- FAQPage and WebApplication JSON-LD
- Generated sitemap.xml and robots.txt
- Google Search Console verification file and metadata

## Affiliate links

Provider buttons are implemented as sponsored/nofollow link slots and currently
point to each provider homepage. Replace those URLs in lib/transferData.ts with
approved affiliate tracking links before launch.
