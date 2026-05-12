import type { ApiResult } from "@/lib/types";

export class ApiError extends Error {
  constructor(message: string, public status?: number, public source?: string) {
    super(message);
  }
}

export async function fetchJson<T>(url: string, options: { source: string; timeoutMs?: number; fallback: T; init?: RequestInit }): Promise<ApiResult<T>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 9000);
  try {
    const response = await fetch(url, {
      ...options.init,
      headers: { Accept: "application/json", "User-Agent": "WorldCrisisDashboard/1.0", ...options.init?.headers },
      signal: controller.signal,
      next: { revalidate: 300 },
    });
    if (!response.ok) throw new ApiError(`${options.source} returned ${response.status}`, response.status, options.source);
    const data = (await response.json()) as T;
    return { data, source: options.source, fetchedAt: new Date().toISOString() };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown API failure";
    return { data: options.fallback, source: options.source, fetchedAt: new Date().toISOString(), fallback: true, warning: message };
  } finally {
    clearTimeout(timeout);
  }
}

export const queryPolicy = {
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  retry: 1,
};
