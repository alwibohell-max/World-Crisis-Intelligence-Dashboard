"use client";
import L from "leaflet";
import { CircleMarker, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { EarthquakeEvent, OSMInfrastructurePoint, SavedLocation, WeatherForecast } from "@/lib/types";

const icon = L.icon({ iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png", shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png", iconSize: [25, 41], iconAnchor: [12, 41] });
function color(score: number) { return score > 90 ? "#a855f7" : score > 70 ? "#ef4444" : score > 45 ? "#f97316" : score > 20 ? "#eab308" : "#22c55e"; }
export default function LeafletCrisisMap({ earthquakes = [], forecasts = [], infrastructure = [], savedLocations = [] }: { earthquakes?: EarthquakeEvent[]; forecasts?: WeatherForecast[]; infrastructure?: OSMInfrastructurePoint[]; savedLocations?: SavedLocation[] }) {
  return <MapContainer center={[20, 0]} zoom={2} className="h-[520px] rounded-lg border"><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{earthquakes.map((e) => <CircleMarker key={e.id} center={e.coordinates} radius={Math.max(5, e.magnitude * 2)} pathOptions={{ color: color(e.risk.score), fillOpacity: 0.55 }}><Popup><b>{e.place}</b><br />M {e.magnitude} · {e.risk.level}</Popup></CircleMarker>)}{forecasts.map((f) => <CircleMarker key={f.location.id} center={[f.location.latitude, f.location.longitude]} radius={10} pathOptions={{ color: color(f.risk.score), fillOpacity: 0.45 }}><Popup><b>{f.location.name}</b><br />Weather risk {f.risk.level}</Popup></CircleMarker>)}{infrastructure.map((p) => <Marker key={p.id} icon={icon} position={[p.latitude, p.longitude]}><Popup><b>{p.name}</b><br />{p.kind}</Popup></Marker>)}{savedLocations.map((p) => <Marker key={p.id} icon={icon} position={[p.latitude, p.longitude]}><Popup><b>{p.name}</b><br />Saved location</Popup></Marker>)}</MapContainer>;
}
