import type { OSMInfrastructurePoint, WeatherLocation } from "@/lib/types";
import { fetchJson } from "./client";

type NominatimItem = { place_id: number; display_name: string; lat: string; lon: string; type: string };
type OverpassElement = { id: number; lat?: number; lon?: number; tags?: Record<string, string>; center?: { lat: number; lon: number } };
type OverpassPayload = { elements?: OverpassElement[] };

export async function nominatimSearch(query: string) {
  const result = await fetchJson<NominatimItem[]>(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&q=${encodeURIComponent(query)}`, { source: "OpenStreetMap Nominatim API", fallback: [] });
  return { ...result, data: result.data.map((item) => ({ id: String(item.place_id), name: item.display_name.split(",")[0], country: item.display_name, latitude: Number(item.lat), longitude: Number(item.lon), timezone: item.type } satisfies WeatherLocation)) };
}

export async function getInfrastructure(lat: number, lon: number, radiusM = 12000) {
  const query = `[out:json][timeout:25];(node[amenity~"hospital|police|fire_station|shelter"](around:${radiusM},${lat},${lon});way[amenity~"hospital|police|fire_station|shelter"](around:${radiusM},${lat},${lon});node[aeroway=aerodrome](around:${radiusM},${lat},${lon});node[harbour](around:${radiusM},${lat},${lon}););out center 80;`;
  const result = await fetchJson<OverpassPayload>(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`, { source: "Overpass API", timeoutMs: 15000, fallback: { elements: [] } });
  return { ...result, data: (result.data.elements ?? []).map(normalizePoint).filter((item): item is OSMInfrastructurePoint => item !== null) };
}

function normalizePoint(element: OverpassElement): OSMInfrastructurePoint | null {
  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;
  if (lat === undefined || lon === undefined) return null;
  const amenity = element.tags?.amenity;
  const kind = amenity === "hospital" || amenity === "police" || amenity === "fire_station" || amenity === "shelter" ? amenity : element.tags?.aeroway === "aerodrome" ? "airport" : "port";
  return { id: String(element.id), name: element.tags?.name ?? kind.replace("_", " "), kind, latitude: lat, longitude: lon, tags: element.tags ?? {} };
}
