import Link from "next/link";
import { getCustomer, getMyOrders } from "@/lib/customer-auth";
import { getI18n } from "@/lib/i18n/server";
import type { Key } from "@/lib/i18n/dictionaries";
import { updateProfile } from "./actions";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const [{ saved, error }, me, orders, { t, fmt, locale }] = await Promise.all([
    searchParams, getCustomer(), getMyOrders(), getI18n(),
  ]);
  if (!me) return null; // the layout already redirects
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium", numberingSystem: "latn" } as Intl.DateTimeFormatOptions);

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_20rem]">
      <section>
        {orders.length === 0 ? (
          <p className="text-foreground/60">{t("account.noOrders")}</p>
        ) : (
          <ul className="space-y-5">
            {orders.map((o) => (
              <li key={o.id} className="border border-line bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl" dir="ltr">{o.id}</p>
                    <p className="text-xs text-foreground/50">{date.format(new Date(o.createdAt))} · {t("account.items", { n: o.items.reduce((n, i) => n + i.qty, 0) })}</p>
                  </div>
                  <div className="text-end">
                    <span className="inline-block border border-gold px-3 py-1 text-[0.65rem] uppercase tracking-widest text-gold">
                      {t(`status.${o.status}` as Key)}
                    </span>
                    <p className="mt-1 text-lg text-gold">{fmt(o.total)}</p>
                    {o.status === "pending" && (
                      <Link href={`/checkout/pay?order=${o.id}`} className="btn mt-2 !px-4 !py-2 !text-[0.65rem]">{t("account.payNow")}</Link>
                    )}
                  </div>
                </div>
                <ul className="mt-4 divide-y divide-line border-t border-line text-sm">
                  {o.items.map((i, n) => (
                    <li key={n} className="flex justify-between gap-3 py-2">
                      <span>
                        {i.qty} × {i.name}
                        <span className="text-foreground/40"> {[i.variant, i.color].filter(Boolean).join(" · ")}</span>
                      </span>
                      <span>{fmt(i.price * i.qty)}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside>
        <h2 className="mb-4 font-display text-3xl">{t("account.profile")}</h2>
        <form action={updateProfile} className="space-y-4">
          <div><label className="label">{t("auth.name")}</label><input name="name" required defaultValue={me.name} className="field" /></div>
          <div><label className="label">{t("auth.email")}</label><input value={me.email} disabled dir="ltr" className="field opacity-60" readOnly /></div>
          <div><label className="label">{t("account.phone")}</label><input name="phone" defaultValue={me.phone ?? ""} dir="ltr" className="field" /></div>
          <div><label className="label">{t("account.address")}</label><textarea name="address" rows={3} defaultValue={me.address ?? ""} className="field" /></div>
          {me.hasPassword && (
            <div><label className="label">{t("account.currentPassword")}</label><input name="current_password" type="password" autoComplete="current-password" dir="ltr" className="field" /></div>
          )}
          <div><label className="label">{t("account.newPassword")}</label><input name="password" type="password" autoComplete="new-password" dir="ltr" className="field" /></div>
          {saved && <p className="text-sm text-gold">{t("account.saved")}</p>}
          {error === "short" && <p className="text-sm text-red-400">{t("auth.err.short")}</p>}
          {error === "password" && <p className="text-sm text-red-400">{t("auth.err.password")}</p>}
          <button className="btn w-full">{t("account.save")}</button>
        </form>
      </aside>
    </div>
  );
}
