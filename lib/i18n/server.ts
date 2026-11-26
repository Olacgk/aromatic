import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE, dirOf, isLocale, matchLocale, type Locale } from "./config";
import { makeFmt, makeT } from "./translate";
import { readDB } from "../db";
import type { DB } from "../types";

/** Cookie first (explicit choice), then Accept-Language, then English. */
export async function getLocale(): Promise<Locale> {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;
  return matchLocale((await headers()).get("accept-language"));
}

export async function getI18n() {
  const locale = await getLocale();
  return { locale, dir: dirOf(locale), t: makeT(locale), fmt: makeFmt(locale) };
}

/** Applies the per-locale overrides stored in `tr` on top of the base (English) content. */
export function localizeDB(db: DB, locale: Locale): DB {
  if (locale === "en") return db;
  const s = db.settings.tr?.[locale];
  return {
    ...db,
    settings: {
      ...db.settings,
      about: s?.about || db.settings.about,
      promo: { ...db.settings.promo, text: s?.promoText || db.settings.promo.text },
      newsletter: { ...db.settings.newsletter, title: s?.newsletterTitle || db.settings.newsletter.title },
    },
    categories: db.categories.map((c) => ({
      ...c,
      name: c.tr?.[locale]?.name || c.name,
      description: c.tr?.[locale]?.description || c.description,
    })),
    products: db.products.map((p) => ({
      ...p,
      name: p.tr?.[locale]?.name || p.name,
      description: p.tr?.[locale]?.description || p.description,
    })),
    pages: db.pages.map((pg) => ({
      ...pg,
      title: pg.tr?.[locale]?.title || pg.title,
      content: pg.tr?.[locale]?.content || pg.content,
    })),
  };
}

/** Storefront data in the visitor's language. */
export async function readLocalizedDB() {
  const [db, locale] = await Promise.all([readDB(), getLocale()]);
  return localizeDB(db, locale);
}
