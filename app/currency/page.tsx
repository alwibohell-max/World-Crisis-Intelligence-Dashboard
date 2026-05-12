import { getLatestRates, getRateTimeseries } from "@/lib/api/currency";
import { MetricCard } from "@/components/cards/MetricCard";
import { CurrencyTrendChart } from "@/components/charts/CurrencyTrendChart";

export default async function CurrencyPage() {
  const [rates, trend] = await Promise.all([getLatestRates("USD"), getRateTimeseries("USD", "EUR")]);
  const top = Object.entries(rates.data.rates).slice(0, 8);
  const series = trend.data;
  const latest = series.at(-1);
  const first = series[0];
  const change = latest && first ? ((latest.value - first.value) / first.value) * 100 : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Currency & Economy Signals</h1>

      <div className="grid gap-4 md:grid-cols-4">
        {top.map(([code, rate]) => (
          <MetricCard key={code} label={`USD to ${code}`} value={rate.toFixed(3)} detail={rates.data.date} />
        ))}
      </div>

      <div className="rounded-lg border p-4">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="font-semibold">30-day USD/EUR trend</h2>
            <p className="text-xs text-muted-foreground">Source: Frankfurter API</p>
          </div>
          {latest ? (
            <div className="text-right">
              <div className="text-2xl font-semibold tabular-nums">{latest.value.toFixed(5)}</div>
              <div className={`text-xs ${change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {change >= 0 ? "+" : ""}
                {change.toFixed(2)}% over 30 days
              </div>
            </div>
          ) : null}
        </div>
        {series.length > 0 ? (
          <CurrencyTrendChart data={series} from="USD" to="EUR" />
        ) : (
          <p className="text-sm text-muted-foreground">No trend data available.</p>
        )}
      </div>
    </div>
  );
}
