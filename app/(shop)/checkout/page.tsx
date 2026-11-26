"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useI18n } from "@/components/LocaleProvider";
import { placeOrder } from "./actions";

export default function Checkout() {
  const { lines, total, clear } = useCart();
  const { t, fmt } = useI18n();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  if (done)
    return (
      <div className="mx-auto max-w-xl px-5 py-28 text-center">
        <h1 className="mb-3 font-display text-5xl">{t("checkout.thanks")}</h1>
        <p className="mb-6 text-foreground/60">{t("checkout.placed", { id: done })}</p>
        <Link href="/" className="btn">{t("checkout.home")}</Link>
      </div>
    );

  if (!lines.length)
    return (
      <div className="px-5 py-28 text-center">
        <p className="mb-4">{t("cart.emptyShort")}</p>
        <Link href="/collections/all" className="btn">{t("checkout.shop")}</Link>
      </div>
    );

  return (
    <form
      className="mx-auto grid max-w-4xl gap-10 px-5 py-16 md:grid-cols-2"
      action={async (fd) => {
        setBusy(true);
        const { id } = await placeOrder({
          customer: {
            name: String(fd.get("name")),
            email: String(fd.get("email")),
            phone: String(fd.get("phone")),
            address: String(fd.get("address")),
          },
          items: lines.map((l) => ({
            productId: l.productId, name: l.name, variant: l.variant, color: l.color, price: l.price, qty: l.qty,
          })),
        });
        clear();
        setDone(id);
      }}
    >
      <div className="space-y-4">
        <h1 className="font-display text-5xl">{t("checkout.title")}</h1>
        <div><label className="label">{t("checkout.name")}</label><input name="name" required className="field" /></div>
        <div><label className="label">{t("checkout.email")}</label><input name="email" type="email" required className="field" /></div>
        <div><label className="label">{t("checkout.phone")}</label><input name="phone" required className="field" /></div>
        <div><label className="label">{t("checkout.address")}</label><textarea name="address" required rows={3} className="field" /></div>
      </div>
      <div>
        <h2 className="mb-4 font-display text-3xl">{t("checkout.summary")}</h2>
        <ul className="mb-4 space-y-2 text-sm">
          {lines.map((l) => (
            <li key={l.key} className="flex justify-between">
              <span>{l.qty} × {l.name} {l.variant}</span>
              <span>{fmt(l.price * l.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="mb-4 text-xl text-gold">{t("cart.total")}: {fmt(total)}</p>
        <button className="btn w-full" disabled={busy}>{busy ? t("checkout.placing") : t("checkout.place")}</button>
      </div>
    </form>
  );
}
