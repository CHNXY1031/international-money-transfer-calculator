import assert from "node:assert/strict";
import test from "node:test";

import {
  buildComparisonText,
  estimateTransfers,
  getExchangeRate,
  getStaticTransferParams,
} from "../lib/transferData";

test("cross-rate calculation is reciprocal", () => {
  const usdToCny = getExchangeRate("USD", "CNY");
  const cnyToUsd = getExchangeRate("CNY", "USD");

  assert.ok(Math.abs(usdToCny * cnyToUsd - 1) < 1e-10);
});

test("results are sorted by recipient amount and include a bank benchmark", () => {
  const results = estimateTransfers(5000, "USD", "CNY");

  assert.equal(results.length, 5);
  assert.ok(results.some((result) => result.providerId === "bank-wire"));
  for (let index = 1; index < results.length; index += 1) {
    assert.ok(
      results[index - 1].recipientGets >= results[index].recipientGets,
    );
  }
});

test("comparison calculates positive savings against traditional bank wire", () => {
  const results = estimateTransfers(5000, "USD", "INR");
  const bank = results.find((result) => result.providerId === "bank-wire");
  const best = results[0];

  assert.ok(bank);
  assert.equal(bank.savingsVsBankUsd, 0);
  assert.ok(best.savingsVsBankUsd > 0);
  assert.match(
    buildComparisonText(5000, "USD", "INR", results),
    /Estimates are not live quotes/,
  );
});

test("pSEO matrix pre-renders more than 200 valid route combinations", () => {
  const params = getStaticTransferParams();
  const unique = new Set(
    params.map(({ from, to, amount }) => [from, to, amount].join("-")),
  );

  assert.ok(params.length > 200);
  assert.equal(unique.size, params.length);
});
