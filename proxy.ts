import { NextResponse, type NextRequest } from "next/server";

/**
 * Keeps JWT sessions alive. The access token cookie expires before the API's token does; when a request arrives
 * without it but with a refresh token, ask the API for a new pair, set the cookies and forward them to the page
 * being rendered. (Server components cannot set cookies themselves, which is why this lives here.)
 * Self-contained on purpose: proxies must not rely on shared modules.
 */
const API_URL = (process.env.API_URL ?? "http://localhost:8010/api").replace(/\/$/, "");
const SCOPES = ["shop", "admin"] as const;
const ACCESS_MAX_AGE = 25 * 60;
const REFRESH_MAX_AGE = 30 * 24 * 3600;

type Tokens = { access: string; refresh: string };

async function refresh(token: string): Promise<Tokens | null> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: token }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const d = (await res.json()) as Partial<Tokens>;
    return d.access ? { access: d.access, refresh: d.refresh ?? token } : null;
  } catch {
    return null; // API down: keep the cookie, try again on the next request
  }
}

export async function proxy(req: NextRequest) {
  const renewed = new Map<string, string>();
  const dropped: string[] = [];
  const outCookies: { name: string; value: string; maxAge: number }[] = [];

  for (const scope of SCOPES) {
    const access = `${scope}_access`;
    const refreshName = `${scope}_refresh`;
    const rt = req.cookies.get(refreshName)?.value;
    if (req.cookies.get(access)?.value || !rt) continue;
    const t = await refresh(rt);
    if (t) {
      renewed.set(access, t.access);
      renewed.set(refreshName, t.refresh);
      outCookies.push({ name: access, value: t.access, maxAge: ACCESS_MAX_AGE }, { name: refreshName, value: t.refresh, maxAge: REFRESH_MAX_AGE });
    } else if (t === null && rt) {
      // Refresh token rejected (expired, account suspended): end the session.
      dropped.push(refreshName);
    }
  }
  if (!renewed.size && !dropped.length) return NextResponse.next();

  // Forward the new cookies to the render of this very request.
  const jar = new Map(req.cookies.getAll().map((c) => [c.name, c.value]));
  for (const [k, v] of renewed) jar.set(k, v);
  for (const k of dropped) jar.delete(k);
  const headers = new Headers(req.headers);
  headers.set("cookie", [...jar].map(([k, v]) => `${k}=${v}`).join("; "));

  const res = NextResponse.next({ request: { headers } });
  const base = { httpOnly: true, sameSite: "lax" as const, path: "/", secure: process.env.NODE_ENV === "production" };
  for (const c of outCookies) res.cookies.set(c.name, c.value, { ...base, maxAge: c.maxAge });
  for (const k of dropped) res.cookies.delete(k);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|img/|.*\\.(?:png|jpg|jpeg|webp|svg|ico)$).*)"],
};
