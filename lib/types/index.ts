export type Severity = "Low" | "Guarded" | "Elevated" | "High" | "Critical";

export interface ApiResult<T> {
  data: T;
  source: string;
  fetchedAt: string;
  fallback?: boolean;
  warning?: string;
}

export interface RiskScore {
  score: number;
  level: Severity;
  factors: { label: string; value: number; description?: string }[];
}

export interface EarthquakeEvent {
  id: string;
  title: string;
  place: string;
  magnitude: number;
  depthKm: number;
  time: string;
  updated: string;
  tsunami: boolean;
  url: string;
  coordinates: [number, number];
  risk: RiskScore;
}

export interface WeatherLocation {
  id: string;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface WeatherForecast {
  location: WeatherLocation;
  current: { temperatureC: number; windKph: number; precipitationMm: number; weatherCode: number; time: string };
  hourly: { time: string; temperatureC: number; precipitationMm: number; windKph: number }[];
  daily: { date: string; tempMaxC: number; tempMinC: number; precipitationMm: number; windMaxKph: number }[];
  risk: RiskScore;
}

export interface CountryProfile {
  cca2: string;
  cca3: string;
  name: string;
  officialName: string;
  flag: string;
  capital: string[];
  region: string;
  subregion?: string;
  population: number;
  latlng: [number, number];
  currencies: string[];
  languages: string[];
  borders: string[];
  maps?: string;
  wikipedia?: { title: string; extract: string; url: string };
  indicators?: WorldBankIndicator[];
  risk: RiskScore;
}

export interface WorldBankIndicator {
  code: string;
  name: string;
  value: number | null;
  date: string;
}

export interface CrisisEvent {
  id: string;
  category: "earthquake" | "weather" | "country" | "infrastructure" | "economy" | "news";
  title: string;
  description: string;
  time: string;
  location?: string;
  coordinates?: [number, number];
  risk: RiskScore;
  source: string;
}

export interface SavedLocation {
  id: string;
  name: string;
  type: "city" | "country" | "coordinates";
  latitude: number;
  longitude: number;
  country?: string;
  createdAt: string;
  notes?: string;
}

export interface OSMInfrastructurePoint {
  id: string;
  name: string;
  kind: "hospital" | "police" | "fire_station" | "shelter" | "airport" | "port";
  latitude: number;
  longitude: number;
  tags: Record<string, string>;
}

export interface CurrencyRate {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface SearchResult {
  id: string;
  type: "country" | "city" | "earthquake" | "wikipedia";
  title: string;
  subtitle?: string;
  coordinates?: [number, number];
  payload?: unknown;
}
