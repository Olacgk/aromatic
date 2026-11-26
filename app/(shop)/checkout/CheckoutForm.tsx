"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useAccount } from "@/components/AccountProvider";
import { useI18n } from "@/components/LocaleProvider";
import PaymentMethods from "@/components/PaymentMethods";
import type { PaymentMethod } from "@/lib/types";
import { placeOrderAndPay, startPayment } from "./actions";

type Me = { name: string; email: string; phone: string; address: string } | null;

export default function CheckoutForm({ me, methods }: { me: Me; methods: PaymentMethod[] }) {
  const { name: signedIn } = useAccount();
  const { lines, total, clear } = useCart();
  const { t, fmt } = useI18n();
  const [provider, setProvider] = useState<PaymentMethod["code"]>(methods[0]?.code ?? "wave");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // Set once the order exists: a failed payment start must not create a second order.
  const [order, setOrder] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);

  if (leaving) return <p className="px-5 py-28 text-center text-foreground/70">{t("pay.redirecting")}</p>;

  if (!lines.length && !order)
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
        setError("");
        const res = order
          ? await startPayment(order, provider)
          : await placeOrderAndPay({
              customer: {
                name: String(fd.get("name")),
                email: String(fd.get("email")),
                phone: String(fd.get("phone")),
                address: String(fd.get("address")),
              },
              items: lines.map((l) => ({ productId: l.productId, qty: l.qty, variant: l.variant, color: l.color })),
              provider,
            });
        if (res.ok) {
          setLeaving(true); // the order exists now (stock reserved); leaving to the payment page
          clear();
          window.location.assign(res.checkoutUrl);
          return;
        }
        if (res.order) {
          setOrder(res.order);
          clear();
        }
        setError(res.error || t("pay.error"));
        setBusy(false);
      }}
    >
      <div className="space-y-4">
        <h1 className="font-display text-5xl">{t("checkout.title")}</h1>
        {signedIn ? (
          <p className="text-sm text-gold">{t("checkout.signedIn", { name: signedIn })}</p>
        ) : (
          <Link href="/login?next=/checkout" className="link-u block text-sm text-gold">{t("checkout.signIn")}</Link>
        )}
        <div><label className="label">{t("checkout.name")}</label><input name="name" defaultValue={me?.name} required readOnly={!!order} className="field" /></div>
        <div><label className="label">{t("checkout.email")}</label><input name="email" defaultValue={me?.email} type="email" required readOnly={!!order} className="field" /></div>
        <div><label className="label">{t("checkout.phone")}</label><input name="phone" defaultValue={me?.phone} required readOnly={!!order} className="field" /></div>
        <div><label className="label">{t("checkout.address")}</label><textarea name="address" defaultValue={me?.address} required rows={3} readOnly={!!order} className="field" /></div>
      </div>
      <div className="space-y-5">
        <h2 className="font-display text-3xl">{t("checkout.summary")}</h2>
        {order ? (
          <p className="text-sm text-gold">{t("pay.orderSaved", { id: order })}</p>
        ) : (
          <>
            <ul className="space-y-2 text-sm">
              {lines.map((l) => (
                <li key={l.key} className="flex justify-between">
                  <span>{l.qty} × {l.name} {l.variant}</span>
                  <span>{fmt(l.price * l.qty)}</span>
                </li>
              ))}
            </ul>
            <p className="text-xl text-gold">{t("cart.total")}: {fmt(total)}</p>
          </>
        )}
        <PaymentMethods methods={methods} value={provider} onChange={setProvider} />
        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
        <button className="btn w-full" disabled={busy || !methods.length}>
          {busy ? t("pay.redirecting") : order ? t("pay.retrySubmit") : t("pay.submit")}
        </button>
      </div>
    </form>
  );
}
