"use client";
import { useState } from "react";
import { useI18n } from "@/components/LocaleProvider";
import PaymentMethods from "@/components/PaymentMethods";
import type { PaymentMethod } from "@/lib/types";
import { startPayment } from "../actions";

export default function PayForm({ order, methods }: { order: string; methods: PaymentMethod[] }) {
  const { t } = useI18n();
  const [provider, setProvider] = useState<PaymentMethod["code"]>(methods[0]?.code ?? "wave");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      className="mx-auto max-w-md space-y-6 px-5 py-20"
      action={async () => {
        setBusy(true);
        setError("");
        const res = await startPayment(order, provider);
        if (res.ok) return window.location.assign(res.checkoutUrl);
        setError(res.error || t("pay.error"));
        setBusy(false);
      }}
    >
      <h1 className="font-display text-5xl">{t("pay.title")}</h1>
      <p className="text-sm text-gold" dir="ltr">{order}</p>
      <PaymentMethods methods={methods} value={provider} onChange={setProvider} />
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <button className="btn w-full" disabled={busy || !methods.length}>
        {busy ? t("pay.redirecting") : t("pay.retrySubmit")}
      </button>
    </form>
  );
}
