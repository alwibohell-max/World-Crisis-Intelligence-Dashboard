import { makeRisk } from "@/lib/risk/engine";
import type { CountryProfile, WorldBankIndicator } from "@/lib/types";
import { fetchJson } from "./client";

type RestCountry = { cca2: string; cca3: string; name: { common: string; official: string }; flags: { svg?: string; png?: string; alt?: string }; capital?: string[]; region: string; subregion?: string; population: number; latlng?: [number, number]; currencies?: Record<string, { name: string }>; languages?: Record<string, string>; borders?: string[]; maps?: { googleMaps?: string } };
type WikiSummary = { title?: string; extract?: string; content_urls?: { desktop?: { page?: string } } };
type WBResponse = [unknown, Array<{ indicator: { id: string; value: string }; date: string; value: number | null }>?];

export async function searchCountries(query: string) {
  const endpoint = query.trim() ? `name/${encodeURIComponent(query)}` : "all";
  const result = await fetchJson<RestCountry[]>(`https://restcountries.com/v3.1/${endpoint}?fields=cca2,cca3,name,flags,capital,region,subregion,population,latlng,currencies,languages,borders,maps`, { source: "REST Countries API", fallback: [] });
  return { ...result, data: result.data.map(normalizeCountry) };
}

export async function getCountry(nameOrCode: string) {
  const countries = await searchCountries(nameOrCode);
  const profile = countries.data[0];
  if (!profile) return countries;
  const [wiki, indicators] = await Promise.all([getWikipediaSummary(profile.name), getWorldBankIndicators(profile.cca2)]);
  return { ...countries, data: [{ ...profile, wikipedia: wiki.data, indicators: indicators.data }] };
}

export async function getWikipediaSummary(topic: string) {
  const result = await fetchJson<WikiSummary>(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`, { source: "Wikipedia REST API", fallback: {} });
  return { ...result, data: { title: result.data.title ?? topic, extract: result.data.extract ?? "No summary available.", url: result.data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(topic)}` } };
}

export async function getWorldBankIndicators(countryCode: string) {
  const codes = ["SP.POP.TOTL", "NY.GDP.MKTP.CD", "SP.URB.TOTL.IN.ZS", "SP.DYN.LE00.IN"];
  const results = await Promise.all(codes.map((code) => fetchJson<WBResponse>(`https://api.worldbank.org/v2/country/${countryCode}/indicator/${code}?format=json&per_page=5`, { source: "World Bank API", fallback: [null, []] })));
  const data: WorldBankIndicator[] = results.map((result, index) => {
    const latest = result.data[1]?.find((row) => row.value !== null);
    return { code: codes[index], name: latest?.indicator.value ?? codes[index], value: latest?.value ?? null, date: latest?.date ?? "n/a" };
  });
  return { data, source: "World Bank API", fetchedAt: new Date().toISOString(), fallback: results.some((r) => r.fallback) };
}

function normalizeCountry(country: RestCountry): CountryProfile {
  const gdpContext = country.population > 100_000_000 ? 18 : 8;
  return { cca2: country.cca2, cca3: country.cca3, name: country.name.common, officialName: country.name.official, flag: country.flags.svg ?? country.flags.png ?? "", capital: country.capital ?? [], region: country.region, subregion: country.subregion, population: country.population, latlng: country.latlng ?? [0, 0], currencies: Object.keys(country.currencies ?? {}), languages: Object.values(country.languages ?? {}), borders: country.borders ?? [], maps: country.maps?.googleMaps, risk: makeRisk(gdpContext, [{ label: "Population exposure", value: gdpContext, description: country.population.toLocaleString() }]) };
}
