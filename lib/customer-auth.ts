import { cache } from "react";
import { api, ApiError } from "./api/client";
import { toCustomer } from "./api/mappers";
import { accessToken } from "./session";
import type { Customer, Order } from "./types";
import { toOrder } from "./api/mappers";

/** Same-site relative paths only, to avoid open redirects after login. */
export const safeNext = (n?: string | null) => (n && /^\/(?![/\\])/.test(n) ? n : "/account");

/** Authenticated call as the signed-in shopper. Returns null if nobody is signed in or the session is invalid. */
export async function shopApi<T>(path: string, opts: Parameters<typeof api>[1] = {}): Promise<T | null> {
  const token = await accessToken("shop");
  if (!token) return null;
  try {
    return await api<T>(path, { ...opts, token });
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) return null;
    throw e;
  }
}

/** The signed-in customer (with favorites), or null. Deduplicated per request. */
export const getCustomer = cache(async (): Promise<Customer | null> => {
  const [me, favs] = await Promise.all([
    shopApi<Record<string, unknown>>("/auth/me/"),
    shopApi<{ favorites: number[] }>("/favorites/ids/"),
  ]);
  if (!me) return null;
  return toCustomer({ ...me, avatar_url: me.avatar_url, favorite_ids: favs?.favorites ?? [], is_active: true, date_joined: me.date_joined });
});

export async function getMyOrders(): Promise<Order[]> {
  const orders = await shopApi<Record<string, unknown>[]>("/orders/");
  return (orders ?? []).map((o) => toOrder(o as never));
}
