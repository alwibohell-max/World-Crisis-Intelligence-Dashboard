import { average, clamp } from "@/lib/utils";
import type { OSMInfrastructurePoint, RiskScore, Severity, WeatherForecast } from "@/lib/types";

export function riskLevel(score: number): Severity {
  if (score <= 20) return "Low";
  if (score <= 45) return "Guarded";
  if (score <= 70) return "Elevated";
  if (score <= 90) return "High";
  return "Critical";
}

export function makeRisk(score: number, factors: RiskScore["factors"]): RiskScore {
  const safeScore = Math.round(clamp(score));
  return { score: safeScore, level: riskLevel(safeScore), factors };
}

export function earthquakeRisk(magnitude: number, depthKm: number, time: string): RiskScore {
  const hoursOld = Math.max(1, (Date.now() - new Date(time).getTime()) / 36e5);
  const mag = clamp((magnitude / 8) * 70, 0, 80);
  const depth = clamp((1 - Math.min(depthKm, 300) / 300) * 18, 0, 18);
  const recency = clamp((1 / Math.sqrt(hoursOld)) * 20, 0, 20);
  const score = mag + depth + recency;
  return makeRisk(score, [
    { label: "Magnitude", value: mag, description: magnitude.toFixed(1) },
    { label: "Shallow depth", value: depth, description: `${Math.round(depthKm)} km` },
    { label: "Recency", value: recency, description: `${Math.round(hoursOld)}h old` },
  ]);
}

export function weatherRisk(input: { temperatureC: number; windKph: number; precipitationMm: number }): RiskScore {
  const heat = input.temperatureC > 32 ? (input.temperatureC - 32) * 3 : input.temperatureC < -10 ? Math.abs(input.temperatureC + 10) * 3 : 0;
  const wind = clamp(input.windKph / 1.3, 0, 45);
  const rain = clamp(input.precipitationMm * 3, 0, 45);
  return makeRisk(heat + wind + rain, [
    { label: "Temperature extreme", value: heat, description: `${Math.round(input.temperatureC)}°C` },
    { label: "Wind", value: wind, description: `${Math.round(input.windKph)} km/h` },
    { label: "Precipitation", value: rain, description: `${input.precipitationMm.toFixed(1)} mm` },
  ]);
}

export function infrastructureRisk(points: OSMInfrastructurePoint[]): RiskScore {
  const emergency = points.filter((p) => ["hospital", "police", "fire_station", "shelter"].includes(p.kind)).length;
  const score = clamp(65 - emergency * 5, 10, 85);
  return makeRisk(score, [{ label: "Emergency facilities", value: score, description: `${emergency} mapped nearby` }]);
}

export function combinedRisk(scores: RiskScore[]): RiskScore {
  const score = average(scores.map((item) => item.score));
  return makeRisk(score, scores.flatMap((item) => item.factors).slice(0, 6));
}

export function forecastPeakRisk(forecast: WeatherForecast): RiskScore {
  const daily = forecast.daily.map((day) => weatherRisk({ temperatureC: day.tempMaxC, windKph: day.windMaxKph, precipitationMm: day.precipitationMm }).score);
  return makeRisk(Math.max(forecast.risk.score, ...daily), forecast.risk.factors);
}
