"use client";
import { useI18n } from "./LocaleProvider";
import type { Key } from "@/lib/i18n/dictionaries";
import type { PaymentMethod } from "@/lib/types";

const TINT: Record<PaymentMethod["code"], string> = {
  wave: "bg-[#1dc8ff] text-black",
  orange_money: "bg-[#ff7900] text-black",
  card: "bg-white/90 text-black",
  mock: "bg-white/20 text-white",
};
const ABBR: Record<PaymentMethod["code"], string> = { wave: "W", orange_money: "OM", card: "💳", mock: "T" };

/** Radio list of the payment methods the API says are available. */
export default function PaymentMethods({
  methods, value, onChange,
}: { methods: PaymentMethod[]; value: string; onChange: (code: PaymentMethod["code"]) => void }) {
  const { t } = useI18n();
  if (!methods.length) return <p className="text-sm text-red-400">{t("pay.none")}</p>;
  return (
    <fieldset>
      <legend className="label">{t("pay.methodTitle")}</legend>
      <div className="grid gap-2">
        {methods.map((m) => (
          <label
            key={m.code}
            className={`flex cursor-pointer items-center gap-3 border px-4 py-3 transition ${
              value === m.code ? "border-gold bg-white/5" : "border-line hover:border-gold/60"
            }`}
          >
            <input type="radio" name="provider" value={m.code} checked={value === m.code} onChange={() => onChange(m.code)} className="accent-[var(--gold)]" />
            <span className={`flex size-8 items-center justify-center text-xs font-bold ${TINT[m.code]}`}>{ABBR[m.code]}</span>
            <span className="text-sm">{t(`pay.method.${m.code}` as Key)}</span>
          </label>
        ))}
      </div>
      <p className="mt-2 text-xs text-foreground/50">{t("pay.secure")}</p>
    </fieldset>
  );
}
