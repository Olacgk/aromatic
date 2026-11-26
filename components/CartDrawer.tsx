"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "./CartProvider";
import { useI18n } from "./LocaleProvider";

export default function CartDrawer() {
  const { open, setOpen, lines, total, setQty, remove } = useCart();
  const { t, fmt, dir } = useI18n();
  const off = dir === "rtl" ? "-100%" : "100%";
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed end-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-s border-line bg-card"
            initial={{ x: off }} animate={{ x: 0 }} exit={{ x: off }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b border-line p-6">
              <h2 className="font-display text-2xl">{t("cart.title")}</h2>
              <button onClick={() => setOpen(false)} aria-label={t("cart.close")} className="text-2xl text-foreground/60 hover:text-gold">×</button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              {lines.length === 0 && <p className="text-foreground/60">{t("cart.emptyShort")}</p>}
              {lines.map((l) => (
                <motion.div layout key={l.key} className="flex items-start justify-between gap-3 border-b border-line pb-5">
                  <div>
                    <p className="font-display text-lg">{l.name}</p>
                    <p className="text-xs text-foreground/50">{[l.variant, l.color].filter(Boolean).join(" · ")}</p>
                    <div className="mt-3 flex items-center gap-3 text-sm">
                      <button onClick={() => setQty(l.key, l.qty - 1)} className="h-7 w-7 border border-line hover:border-gold">−</button>
                      <span>{l.qty}</span>
                      <button onClick={() => setQty(l.key, l.qty + 1)} className="h-7 w-7 border border-line hover:border-gold">+</button>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="text-gold">{fmt(l.price * l.qty)}</p>
                    <button onClick={() => remove(l.key)} className="mt-2 text-xs text-foreground/40 underline hover:text-foreground">{t("cart.remove")}</button>
                  </div>
                </motion.div>
              ))}
            </div>
            {lines.length > 0 && (
              <div className="space-y-4 border-t border-line p-6">
                <p className="flex justify-between text-lg">
                  <span>{t("cart.total")}</span>
                  <span className="text-gold">{fmt(total)}</span>
                </p>
                <Link href="/checkout" onClick={() => setOpen(false)} className="btn w-full">{t("cart.checkout")}</Link>
                <Link href="/cart" onClick={() => setOpen(false)} className="block text-center text-sm text-foreground/60 underline">{t("cart.view")}</Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
