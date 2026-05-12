import { getLatestEarthquakes } from "@/lib/api/earthquakes";
import { getForecast, searchLocations } from "@/lib/api/openmeteo";
import { searchCountries } from "@/lib/api/countries";
import { combinedRisk } from "@/lib/risk/engine";
import { MetricCard } from "@/components/cards/MetricCard";
import { RiskScoreCard } from "@/components/cards/RiskScoreCard";
import { CrisisMap } from "@/components/maps/CrisisMap";
import { EarthquakeTable } from "@/components/tables/EarthquakeTable";
import { TimelineEvent } from "@/components/shared/TimelineEvent";
import type { CrisisEvent } from "@/lib/types";

export default async function DashboardPage() {
  const [quakes, cities, countries] = await Promise.all([getLatestEarthquakes(5, 3), searchLocations("Tokyo"), searchCountries("")]);
  const forecast = cities.data[0] ? await getForecast(cities.data[0]) : null;
  const risk = combinedRisk([...(quakes.data.slice(0,5).map((q) => q.risk)), ...(forecast ? [forecast.data.risk] : [])]);
  const events: CrisisEvent[] = quakes.data.slice(0,4).map((q) => ({ id: q.id, category: "earthquake", title: q.title, description: q.place, time: q.time, risk: q.risk, source: "USGS" }));
  return <div className="space-y-6"><div><h1 className="text-3xl font-bold">Global Crisis Overview</h1><p className="text-muted-foreground">Live public-source intelligence snapshot and top risks.</p></div><div className="grid gap-4 md:grid-cols-4"><MetricCard label="Major earthquakes" value={quakes.data.length} detail="USGS, last 3 days" /><MetricCard label="Data sources active" value="9" detail="No-key public APIs" /><MetricCard label="Countries indexed" value={countries.data.length} detail="REST Countries" /><MetricCard label="Freshness" value="Live" detail={new Date().toUTCString()} /></div><div className="grid gap-4 lg:grid-cols-3"><RiskScoreCard title="Global crisis score" risk={risk} /><div className="lg:col-span-2"><CrisisMap earthquakes={quakes.data.slice(0,30)} forecasts={forecast ? [forecast.data] : []} /></div></div><div className="grid gap-6 lg:grid-cols-2"><div><h2 className="mb-3 text-xl font-semibold">Latest major earthquakes</h2><EarthquakeTable events={quakes.data.slice(0,6)} /></div><div><h2 className="mb-3 text-xl font-semibold">Crisis timeline</h2>{events.map((event) => <TimelineEvent key={event.id} event={event} />)}<h2 className="mb-3 mt-4 text-xl font-semibold">Top 5 countries to watch</h2><div className="grid gap-2">{countries.data.slice(0,5).map((c) => <div key={c.cca3} className="rounded border p-3 text-sm">{c.name} · exposure score {c.risk.score}</div>)}</div></div></div></div>;
}
