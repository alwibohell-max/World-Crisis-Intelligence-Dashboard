import { earthquakeRisk } from "@/lib/risk/engine";
import type { EarthquakeEvent } from "@/lib/types";
import { fetchJson } from "./client";

type USGSFeature = { id: string; properties: { mag: number | null; place: string | null; time: number; updated: number; tsunami: number; url: string; title: string | null }; geometry: { coordinates: [number, number, number] } };
type USGSResponse = { features?: USGSFeature[] };

export async function getLatestEarthquakes(minMagnitude = 4.5, days = 7) {
  const starttime = new Date(Date.now() - days * 864e5).toISOString();
  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=time&limit=120&minmagnitude=${minMagnitude}&starttime=${starttime}`;
  const result = await fetchJson<USGSResponse>(url, { source: "USGS Earthquake API", fallback: { features: [] } });
  return { ...result, data: normalizeEarthquakes(result.data) };
}

export function normalizeEarthquakes(payload: USGSResponse): EarthquakeEvent[] {
  return (payload.features ?? []).filter((feature) => typeof feature.properties.mag === "number").map((feature) => {
    const [lon, lat, depth = 0] = feature.geometry.coordinates;
    const magnitude = feature.properties.mag ?? 0;
    const time = new Date(feature.properties.time).toISOString();
    return {
      id: feature.id,
      title: feature.properties.title ?? `M ${magnitude} earthquake`,
      place: feature.properties.place ?? "Unknown region",
      magnitude,
      depthKm: depth,
      time,
      updated: new Date(feature.properties.updated).toISOString(),
      tsunami: feature.properties.tsunami === 1,
      url: feature.properties.url,
      coordinates: [lat, lon],
      risk: earthquakeRisk(magnitude, depth, time),
    };
  });
}
