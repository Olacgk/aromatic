import { cache } from "react";
import { api, apiAll } from "./client";
import { toCategory, toPage, toProduct, toSettings } from "./mappers";
import type { Category, PageDoc, PaymentMethod, Product, Settings } from "../types";

export type Store = { settings: Settings; categories: Category[]; products: Product[]; pages: PageDoc[] };

/** The whole public catalog in one language, fetched once per request (React `cache` de-duplicates calls). */
export const getStore = cache(async (lang: string): Promise<Store> => {
  const [settings, categories, products, pages] = await Promise.all([
    api("/settings/", { query: { lang } }),
    api<unknown[]>("/categories/", { query: { lang } }),
    apiAll("/products/", { query: { lang } }),
    api<unknown[]>("/pages/", { query: { lang } }),
  ]);
  return {
    settings: toSettings(settings as never),
    categories: categories.map((c) => toCategory(c as never)),
    products: products.map((p) => toProduct(p as never)),
    pages: pages.map((p) => toPage(p as never)),
  };
});

export const getPaymentMethods = cache(async (): Promise<PaymentMethod[]> => {
  try {
    return await api<PaymentMethod[]>("/payments/methods/");
  } catch {
    return [];
  }
});
