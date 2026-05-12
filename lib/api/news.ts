import { fetchJson } from "./client";

export interface NewsSignal { id: string; title: string; url: string; time: string; source: string }

type HNItem = { id: number; title?: string; url?: string; time?: number };
type SpaceflightArticle = { id: number; title: string; url: string; published_at: string; news_site: string };

type ReliefWebPayload = { data?: Array<{ id: string; fields?: { title?: string; url?: string; date?: { created?: string } } }> };

export async function getHackerNewsSignals() {
  const ids = await fetchJson<number[]>("https://hacker-news.firebaseio.com/v0/topstories.json", { source: "Hacker News Firebase API", fallback: [] });
  const items = await Promise.all(ids.data.slice(0, 8).map((id) => fetchJson<HNItem>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { source: "Hacker News Firebase API", fallback: { id } })));
  return { data: items.map((item) => ({ id: String(item.data.id), title: item.data.title ?? "Untitled signal", url: item.data.url ?? "https://news.ycombinator.com", time: new Date((item.data.time ?? Date.now() / 1000) * 1000).toISOString(), source: "Hacker News" })), source: "Hacker News Firebase API", fetchedAt: new Date().toISOString(), fallback: ids.fallback };
}

export async function getSpaceflightNews() {
  const result = await fetchJson<SpaceflightArticle[]>("https://api.spaceflightnewsapi.net/v4/articles/?limit=6", { source: "Spaceflight News API", fallback: [] });
  return { ...result, data: result.data.map((item) => ({ id: String(item.id), title: item.title, url: item.url, time: item.published_at, source: item.news_site })) };
}

export async function getReliefWebUpdates() {
  const url = "https://api.reliefweb.int/v1/reports?appname=world-crisis-dashboard&limit=5&profile=list&preset=latest";
  const result = await fetchJson<ReliefWebPayload>(url, { source: "ReliefWeb API", fallback: { data: [] } });
  return { ...result, data: (result.data.data ?? []).map((item) => ({ id: item.id, title: item.fields?.title ?? "ReliefWeb update", url: item.fields?.url ?? "https://reliefweb.int", time: item.fields?.date?.created ?? new Date().toISOString(), source: "ReliefWeb" })) };
}
