export const LOCALES = ["en", "fr", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

export const isLocale = (v: unknown): v is Locale => LOCALES.includes(v as Locale);
export const dirOf = (l: Locale): "ltr" | "rtl" => (l === "ar" ? "rtl" : "ltr");

/** Picks the best supported locale from an Accept-Language header. */
export function matchLocale(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;
  const wanted = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.slice(0, 2).toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  return wanted.find((w) => isLocale(w.lang))?.lang as Locale | undefined ?? DEFAULT_LOCALE;
}

const NUMBER_LOCALE: Record<Locale, string> = { en: "en-US", fr: "fr-FR", ar: "ar-u-nu-latn" };

/** CFA amounts: "CFA45,000" (en), "45 000 CFA" (fr), "45,000 CFA" (ar). */
export function formatPrice(n: number, locale: Locale = "en") {
  const num = n.toLocaleString(NUMBER_LOCALE[locale]);
  return locale === "en" ? `CFA${num}` : `${num} CFA`;
}
