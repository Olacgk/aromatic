"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "@/components/AccountProvider";
import { useI18n } from "@/components/LocaleProvider";
import type { Key } from "@/lib/i18n/dictionaries";
import type { Payment, PaymentMethod } from "@/lib/types";
import { getPayment } from "../actions";

const POLL_MS = 2500;
const MAX_POLLS = 16; // ~40 s, then we stop and tell the customer to check their account

export default function ResultView({ paymentId, methods }: { paymentId: string; methods: PaymentMethod[] }) {
  const { t } = useI18n();
  const { name } = useAccount();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    let stop = false;
    let n = 0;
    async function tick() {
      const p = await getPayment(paymentId);
      if (stop) return;
      if (p) setPayment(p);
      if (p?.status === "pending" || !p) {
        if (++n >= MAX_POLLS) return setGaveUp(true);
        setTimeout(tick, POLL_MS);
      }
    }
    tick();
    return () => {
      stop = true;
    };
  }, [paymentId]);

  const status = payment?.status ?? "pending";
  const done = status === "succeeded";
  const retryable = status === "failed" || status === "cancelled" || status === "expired";
  const id = payment?.order ?? "";

  return (
    <div className="mx-auto max-w-xl px-5 py-28 text-center">
      <h1 className="mb-3 font-display text-5xl">
        {done ? t("result.success.title") : status === "pending" ? t("result.pending.title") : t(`result.${status === "failed" ? "failed" : status}.title` as Key)}
      </h1>
      <p className="mb-8 text-foreground/60">
        {done
          ? t("result.success.text", { id })
          : status === "pending"
            ? gaveUp ? t("result.waited") : t("result.pending.text")
            : t("result.failed.text", { id })}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {retryable && methods.length > 0 && (
          <Link href={`/checkout/pay?order=${id}`} className="btn">{t("result.retry")}</Link>
        )}
        {(done || gaveUp) && name && <Link href="/account" className="btn-outline btn">{t("result.orders")}</Link>}
        <Link href="/" className="btn-outline btn">{t("checkout.home")}</Link>
      </div>
    </div>
  );
}
