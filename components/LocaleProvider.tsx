"use client";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { dirOf, type Locale } from "@/lib/i18n/config";
import { makeFmt, makeT, type T } from "@/lib/i18n/translate";

type Ctx = { locale: Locale; dir: "ltr" | "rtl"; t: T; fmt: (n: number) => string };
const LocaleCtx = createContext<Ctx | null>(null);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo(
    () => ({ locale, dir: dirOf(locale), t: makeT(locale), fmt: makeFmt(locale) }),
    [locale],
  );
  return <LocaleCtx.Provider value={value}>{children}</LocaleCtx.Provider>;
}

export function useI18n() {
  const c = useContext(LocaleCtx);
  if (!c) throw new Error("useI18n outside LocaleProvider");
  return c;
}
