import type { CurrencyRate } from "@/lib/types";
import { fetchJson } from "./client";

type Frankfurter = { base: string; date: string; rates: Record<string, number> };

export async function getLatestRates(base = "USD") {
  const result = await fetchJson<Frankfurter>(`https://api.frankfurter.app/latest?from=${base}`, { source: "Frankfurter API", fallback: { base, date: new Date().toISOString().slice(0, 10), rates: {} } });
  return { ...result, data: result.data satisfies CurrencyRate };
}

export async function getRateTimeseries(from: string, to: string) {
  const start = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
  const result = await fetchJson<{ rates: Record<string, Record<string, number>> }>(`https://api.frankfurter.app/${start}..?from=${from}&to=${to}`, { source: "Frankfurter API", fallback: { rates: {} } });
  return { ...result, data: Object.entries(result.data.rates).map(([date, rates]) => ({ date, value: rates[to] ?? 0 })) };
}
