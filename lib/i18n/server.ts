import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE, dirOf, isLocale, matchLocale, type Locale } from "./config";
import { makeFmt, makeT } from "./translate";
import { getStore } from "../api/store";

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

/** Storefront data in the visitor's language. The API applies the translations (`?lang=`). */
export async function readLocalizedDB() {
  return getStore(await getLocale());
}
