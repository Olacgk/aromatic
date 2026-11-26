"use client";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useI18n } from "@/components/LocaleProvider";

export default function CartPage() {
  const { lines, total, setQty, remove } = useCart();
  const { t, fmt } = useI18n();

  if (!lines.length)
    return (
      <div className="mx-auto max-w-3xl px-5 py-28 text-center">
        <h1 className="mb-6 font-display text-5xl">{t("cart.empty")}</h1>
        <Link href="/collections/all" className="btn">{t("cart.continue")}</Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="mb-10 font-display text-5xl">{t("cart.title")}</h1>
      <div className="divide-y divide-line border-y border-line">
        {lines.map((l) => (
          <div key={l.key} className="flex flex-wrap items-center justify-between gap-4 py-5">
            <div>
              <Link href={`/products/${l.slug}`} className="font-display text-xl hover:text-gold">{l.name}</Link>
              <p className="text-sm text-foreground/50">{[l.variant, l.color].filter(Boolean).join(" · ")}</p>
              <p className="text-sm text-gold">{fmt(l.price)}</p>
            </div>
            <div className="flex items-center gap-4">
              <input type="number" min={1} value={l.qty} onChange={(e) => setQty(l.key, +e.target.value || 1)} className="field w-20" />
              <span className="w-28 text-end">{fmt(l.price * l.qty)}</span>
              <button onClick={() => remove(l.key)} className="text-sm text-foreground/40 underline hover:text-foreground">{t("cart.remove")}</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between">
        <p className="text-2xl">{t("cart.total")}: <span className="text-gold">{fmt(total)}</span></p>
        <Link href="/checkout" className="btn">{t("cart.checkout")}</Link>
      </div>
    </div>
  );
}
