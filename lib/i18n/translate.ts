import { DICTIONARIES, type Key } from "./dictionaries";
import { formatPrice, type Locale } from "./config";

export type T = (key: Key, vars?: Record<string, string | number>) => string;

export function makeT(locale: Locale): T {
  const dict = DICTIONARIES[locale];
  return (key, vars) => {
    let s = dict[key] ?? DICTIONARIES.en[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };
}

export const makeFmt = (locale: Locale) => (n: number) => formatPrice(n, locale);
