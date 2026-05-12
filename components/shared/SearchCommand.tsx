"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchCountries, getWikipediaSummary } from "@/lib/api/countries";
import { searchLocations } from "@/lib/api/openmeteo";
import type { SearchResult } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";

function resultHref(result: SearchResult): { href: string; external: boolean } {
  if (result.type === "country") {
    return { href: `/countries?q=${encodeURIComponent(result.title)}`, external: false };
  }
  if (result.type === "city") {
    return { href: `/weather?q=${encodeURIComponent(result.title)}`, external: false };
  }
  if (result.type === "wikipedia") {
    const payload = result.payload as { url?: string } | undefined;
    return { href: payload?.url ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`, external: true };
  }
  return { href: "#", external: false };
}

export function SearchCommand() {
  const [q, setQ] = useState("");
  const add = useAppStore((s) => s.addSearch);
  const recent = useAppStore((s) => s.recentSearches);
  const query = useQuery({
    queryKey: ["global-search", q],
    enabled: q.length > 2,
    queryFn: async () => {
      const [countries, cities, wiki] = await Promise.all([searchCountries(q), searchLocations(q), getWikipediaSummary(q)]);
      const results: SearchResult[] = [
        ...countries.data.slice(0, 4).map((c) => ({ id: `country-${c.cca3}`, type: "country" as const, title: c.name, subtitle: c.region, coordinates: c.latlng, payload: c })),
        ...cities.data.slice(0, 4).map((c) => ({ id: `city-${c.id}`, type: "city" as const, title: c.name, subtitle: [c.admin1, c.country].filter(Boolean).join(", "), coordinates: [c.latitude, c.longitude] as [number, number], payload: c })),
        { id: `wiki-${q}`, type: "wikipedia" as const, title: wiki.data.title, subtitle: wiki.data.extract.slice(0, 120), payload: wiki.data },
      ];
      return results;
    },
  });
  const results = q.length > 2 ? query.data ?? [] : recent;
  const showingRecent = q.length <= 2 && recent.length > 0;

  return (
    <div className="space-y-4">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus
        placeholder="Search countries, cities, earthquakes, Wikipedia topics..."
      />
      {showingRecent ? <p className="text-xs uppercase tracking-wide text-muted-foreground">Recent searches</p> : null}
      {q.length > 2 && query.isLoading ? <p className="text-sm text-muted-foreground">Searching...</p> : null}
      {q.length > 2 && !query.isLoading && results.length === 0 ? (
        <p className="text-sm text-muted-foreground">No results.</p>
      ) : null}
      <div className="grid gap-3 md:grid-cols-2">
        {results.map((r) => {
          const { href, external } = resultHref(r);
          const content = (
            <>
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs uppercase text-primary">{r.type}</div>
                {external ? <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" /> : null}
              </div>
              <div className="mt-1 font-semibold">{r.title}</div>
              <div className="line-clamp-2 text-sm text-muted-foreground">{r.subtitle}</div>
            </>
          );
          const baseClass = "block rounded-lg border p-4 text-left transition hover:border-primary/60 hover:bg-secondary";
          if (external) {
            return (
              <a
                key={r.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => add(r)}
                className={baseClass}
              >
                {content}
              </a>
            );
          }
          return (
            <Link key={r.id} href={href} onClick={() => add(r)} className={baseClass}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
