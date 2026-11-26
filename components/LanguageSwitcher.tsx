"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import { setLocale } from "@/lib/i18n/actions";
import { useI18n } from "./LocaleProvider";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [pending, start] = useTransition();

  const choose = (l: Locale) => {
    if (l === locale) return;
    start(async () => {
      await setLocale(l);
      router.refresh();
    });
  };

  return (
    <div
      role="group"
      aria-label={t("nav.language")}
      className={`flex items-center gap-1 ${pending ? "opacity-60" : ""} ${className}`}
      dir="ltr"
    >
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-foreground/20">/</span>}
          <button
            onClick={() => choose(l)}
            lang={l}
            title={LOCALE_LABELS[l]}
            aria-pressed={l === locale}
            className={`px-1 text-[0.7rem] font-semibold uppercase transition ${
              l === locale ? "text-gold" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
