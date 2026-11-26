/** Server-side HTTP client for the Django API. Never imported by client components (tokens stay on the server). */

export const API_URL = (process.env.API_URL ?? "http://localhost:8010/api").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(public status: number, public data: unknown) {
    super(`API ${status}`);
  }
}

type Query = Record<string, string | number | boolean | undefined | null>;
export type ApiOptions = { method?: string; body?: unknown; token?: string | null; query?: Query };

export async function api<T = unknown>(path: string, o: ApiOptions = {}): Promise<T> {
  const url = new URL(API_URL + path);
  for (const [k, v] of Object.entries(o.query ?? {})) if (v !== undefined && v !== null) url.searchParams.set(k, String(v));

  const headers: Record<string, string> = { Accept: "application/json" };
  if (o.token) headers.Authorization = `Bearer ${o.token}`;
  let body: string | undefined;
  if (o.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(o.body);
  }

  const res = await fetch(url, { method: o.method ?? "GET", headers, body, cache: "no-store" });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
}

type Page<T> = { next: string | null; results: T[] };

/** Fetches every page of a paginated endpoint (up to 200 items per request). */
export async function apiAll<T>(path: string, o: ApiOptions = {}): Promise<T[]> {
  const out: T[] = [];
  for (let page = 1; page <= 50; page++) {
    const data = await api<Page<T>>(path, { ...o, query: { ...o.query, page_size: 200, page } });
    out.push(...data.results);
    if (!data.next) break;
  }
  return out;
}

/** A short human-readable message from a DRF error body ({"detail": "..."} or {"field": ["..."]}). */
export function errorMessage(e: unknown, fallback = "Something went wrong."): string {
  if (!(e instanceof ApiError)) return fallback;
  const d = e.data as Record<string, unknown> | null;
  if (!d || typeof d !== "object") return fallback;
  if (typeof d.detail === "string") return d.detail;
  for (const v of Object.values(d)) {
    const first = Array.isArray(v) ? v[0] : v;
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      const nested = errorMessage(new ApiError(e.status, first), "");
      if (nested) return nested;
    }
  }
  return fallback;
}
