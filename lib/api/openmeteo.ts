import { weatherRisk } from "@/lib/risk/engine";
import type { WeatherForecast, WeatherLocation } from "@/lib/types";
import { fetchJson } from "./client";

type GeoPayload = { results?: Array<{ id: number; name: string; country?: string; admin1?: string; latitude: number; longitude: number; timezone?: string }> };
type ForecastPayload = {
  current?: { temperature_2m?: number; wind_speed_10m?: number; precipitation?: number; weather_code?: number; time?: string };
  hourly?: { time?: string[]; temperature_2m?: number[]; precipitation?: number[]; wind_speed_10m?: number[] };
  daily?: { time?: string[]; temperature_2m_max?: number[]; temperature_2m_min?: number[]; precipitation_sum?: number[]; wind_speed_10m_max?: number[] };
};

export async function searchLocations(query: string) {
  if (!query.trim()) return { data: [], source: "Open-Meteo Geocoding API", fetchedAt: new Date().toISOString() };
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`;
  const result = await fetchJson<GeoPayload>(url, { source: "Open-Meteo Geocoding API", fallback: { results: [] } });
  return { ...result, data: (result.data.results ?? []).map(normalizeLocation) };
}

export async function getForecast(location: WeatherLocation) {
  const params = new URLSearchParams({ latitude: String(location.latitude), longitude: String(location.longitude), current: "temperature_2m,precipitation,weather_code,wind_speed_10m", hourly: "temperature_2m,precipitation,wind_speed_10m", daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max", timezone: "auto", forecast_days: "7" });
  const result = await fetchJson<ForecastPayload>(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, { source: "Open-Meteo Forecast API", fallback: {} });
  return { ...result, data: normalizeForecast(location, result.data) };
}

function normalizeLocation(item: NonNullable<GeoPayload["results"]>[number]): WeatherLocation {
  return { id: String(item.id), name: item.name, country: item.country, admin1: item.admin1, latitude: item.latitude, longitude: item.longitude, timezone: item.timezone };
}

function normalizeForecast(location: WeatherLocation, payload: ForecastPayload): WeatherForecast {
  const current = { temperatureC: payload.current?.temperature_2m ?? 0, windKph: payload.current?.wind_speed_10m ?? 0, precipitationMm: payload.current?.precipitation ?? 0, weatherCode: payload.current?.weather_code ?? 0, time: payload.current?.time ?? new Date().toISOString() };
  return {
    location,
    current,
    hourly: (payload.hourly?.time ?? []).slice(0, 48).map((time, index) => ({ time, temperatureC: payload.hourly?.temperature_2m?.[index] ?? 0, precipitationMm: payload.hourly?.precipitation?.[index] ?? 0, windKph: payload.hourly?.wind_speed_10m?.[index] ?? 0 })),
    daily: (payload.daily?.time ?? []).map((date, index) => ({ date, tempMaxC: payload.daily?.temperature_2m_max?.[index] ?? 0, tempMinC: payload.daily?.temperature_2m_min?.[index] ?? 0, precipitationMm: payload.daily?.precipitation_sum?.[index] ?? 0, windMaxKph: payload.daily?.wind_speed_10m_max?.[index] ?? 0 })),
    risk: weatherRisk(current),
  };
}
