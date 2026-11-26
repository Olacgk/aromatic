import { cookies } from "next/headers";

/**
 * JWT session, stored in httpOnly cookies (never readable by browser JS).
 * Two independent scopes so a store admin and a shopper can use the same browser:
 *   shop  -> storefront customers   |   admin -> back-office staff
 * `proxy.ts` renews the access token from the refresh token when it has expired.
 */
export type Scope = "shop" | "admin";

const ACCESS_MAX_AGE = 25 * 60; // a bit shorter than the API's 30 min token, so the proxy renews it in time
const REFRESH_MAX_AGE = 30 * 24 * 3600;

const names = (s: Scope) => ({ access: `${s}_access`, refresh: `${s}_refresh` });

export async function setTokens(scope: Scope, t: { access: string; refresh: string }) {
  const jar = await cookies();
  const base = { httpOnly: true, sameSite: "lax" as const, path: "/", secure: process.env.NODE_ENV === "production" };
  const n = names(scope);
  jar.set(n.access, t.access, { ...base, maxAge: ACCESS_MAX_AGE });
  jar.set(n.refresh, t.refresh, { ...base, maxAge: REFRESH_MAX_AGE });
}

export async function clearTokens(scope: Scope) {
  const jar = await cookies();
  const n = names(scope);
  jar.delete(n.access);
  jar.delete(n.refresh);
}

export async function accessToken(scope: Scope): Promise<string | null> {
  return (await cookies()).get(names(scope).access)?.value ?? null;
}
