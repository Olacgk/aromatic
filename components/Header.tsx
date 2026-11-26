"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "./CartProvider";
import { useI18n } from "./LocaleProvider";
import LanguageSwitcher from "./LanguageSwitcher";

type Cat = { id: string; slug: string; name: string };

export default function Header({ siteName, categories }: { siteName: string; categories: Cat[] }) {
  const { count, setOpen } = useCart();
  const { t } = useI18n();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const nav = (
    <>
      <Link href="/" className="link-u" onClick={() => setMenu(false)}>{t("nav.home")}</Link>
      <div className="group relative">
        <Link href="/collections" className="link-u" onClick={() => setMenu(false)}>{t("nav.categories")}</Link>
        <div className="invisible absolute start-1/2 top-full z-10 min-w-56 -translate-x-1/2 translate-y-2 border border-line bg-card p-2 opacity-0 shadow-2xl transition duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 max-md:hidden rtl:translate-x-1/2">
          {categories.map((c) => (
            <Link key={c.id} href={`/collections/${c.slug}`} className="block px-4 py-2 text-xs tracking-widest text-foreground/80 hover:bg-white/5 hover:text-gold">
              {c.name.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
      <Link href="/collections/all" className="link-u" onClick={() => setMenu(false)}>{t("nav.all")}</Link>
      <Link href="/collections/sale" className="link-u text-gold" onClick={() => setMenu(false)}>{t("nav.sale")}</Link>
    </>
  );

  return (
    <header
      className={`sticky top-0 z-50 transition duration-500 ${
        scrolled ? "border-b border-line bg-background/85 py-3 backdrop-blur-xl" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5">
        <button className="text-2xl md:hidden" aria-label={t("nav.menu")} onClick={() => setMenu((m) => !m)}>
          {menu ? "×" : "☰"}
        </button>
        <nav className="hidden items-center gap-9 text-xs font-medium uppercase tracking-[0.2em] md:flex">{nav}</nav>
        <Link
          href="/"
          className="gold-text font-display text-2xl font-semibold uppercase tracking-[0.25em] md:absolute md:left-1/2 md:-translate-x-1/2"
          dir="ltr"
        >
          {siteName}
        </Link>
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.2em]">
          <LanguageSwitcher className="hidden sm:flex" />
          <button onClick={() => setSearch((s) => !s)} aria-label={t("nav.search")} className="hover:text-gold">{t("nav.search")}</button>
          <button onClick={() => setOpen(true)} className="relative hover:text-gold">
            {t("nav.cart")}
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4 }} animate={{ scale: 1 }}
                  className="ms-2 inline-flex h-5 min-w-5 items-center justify-center bg-gold px-1 text-[0.65rem] font-bold text-black"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {search && (
          <motion.form
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
            onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get("q");
              setSearch(false);
              router.push(`/search?q=${encodeURIComponent(String(q))}`);
            }}
          >
            <div className="mx-auto max-w-2xl px-5 pt-4">
              <input name="q" autoFocus placeholder={t("search.placeholder")} className="field" />
            </div>
          </motion.form>
        )}
        {menu && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-background md:hidden"
          >
            <div className="flex flex-col gap-5 px-5 py-6 text-sm uppercase tracking-[0.2em]">
              {nav}
              <LanguageSwitcher />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
