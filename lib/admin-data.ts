import { redirect } from "next/navigation";
import { api, apiAll, ApiError, API_URL, type ApiOptions } from "./api/client";
import { toCategory, toCustomer, toOrder, toPage, toProduct, toSettings } from "./api/mappers";
import { accessToken } from "./session";
import type { Category, Customer, Order, PageDoc, Product, Settings } from "./types";

/** API call as the signed-in admin. A missing/expired/insufficient session sends the user to the login page. */
export async function adminApi<T = unknown>(path: string, opts: ApiOptions = {}): Promise<T> {
  const token = await accessToken("admin");
  if (!token) redirect("/admin/login");
  try {
    return await api<T>(path, { ...opts, token });
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) redirect("/admin/login");
    throw e;
  }
}

/** Multipart PATCH/POST (file uploads). Fields are strings or Files. */
export async function adminUpload(path: string, form: FormData, method = "PATCH") {
  const token = await accessToken("admin");
  if (!token) redirect("/admin/login");
  const res = await fetch(API_URL + path, { method, body: form, headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!res.ok) throw new ApiError(res.status, await res.json().catch(() => null));
}

export type AdminDB = {
  settings: Settings;
  categories: Category[];
  products: Product[];
  orders: Order[];
  pages: PageDoc[];
  customers: Customer[];
};
type Part = keyof AdminDB;
const ALL: Part[] = ["settings", "categories", "products", "orders", "pages"];

/**
 * Admin data in the UI's shapes. Only the requested parts are fetched
 * (customers are opt-in: they cost one query each for favorites).
 * Untranslated base text + the full `translations` of each item, so the forms can edit every language.
 */
export async function readAdminDB(parts: Part[] = ALL): Promise<AdminDB> {
  const want = new Set(parts);
  const get = async <T,>(part: Part, load: () => Promise<T>, empty: T) => (want.has(part) ? load() : empty);
  const [settings, categories, products, orders, pages, customers] = await Promise.all([
    get("settings", () => adminApi("/settings/").then((s) => toSettings(s as never)), {} as Settings),
    get("categories", () => adminApi<unknown[]>("/categories/").then((l) => l.map((c) => toCategory(c as never))), []),
    get("products", () => adminList("/products/").then((l) => l.map((p) => toProduct(p as never))), []),
    get("orders", () => adminList("/admin/orders/").then((l) => l.map((o) => toOrder(o as never))), []),
    get("pages", () => adminApi<unknown[]>("/pages/").then((l) => l.map((p) => toPage(p as never))), []),
    get("customers", () => adminList("/admin/customers/").then((l) => l.map((c) => toCustomer(c as never))), []),
  ]);
  return { settings, categories, products, orders, pages, customers };
}

async function adminList(path: string): Promise<unknown[]> {
  const token = await accessToken("admin");
  if (!token) redirect("/admin/login");
  try {
    return await apiAll(path, { token });
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) redirect("/admin/login");
    throw e;
  }
}
