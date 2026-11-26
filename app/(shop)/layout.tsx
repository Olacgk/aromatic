import Link from "next/link";
import { getI18n, readLocalizedDB } from "@/lib/i18n/server";
import { CartProvider } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";
import Header from "@/components/Header";
import { AccountProvider } from "@/components/AccountProvider";
import { getCustomer } from "@/lib/customer-auth";
import { LocaleProvider } from "@/components/LocaleProvider";

export const dynamic = "force-dynamic";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const [{ settings: s, categories }, { locale, t }, me] = await Promise.all([readLocalizedDB(), getI18n(), getCustomer()]);
  return (
    <LocaleProvider locale={locale}>
      <AccountProvider name={me?.name ?? null} favorites={me?.favorites ?? []}>
      <CartProvider>
        <div className="shop contents">
          {s.promo.enabled && (
            <div className="bg-gold px-4 py-2.5 text-center text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-black">
              {s.promo.text} <span className="mx-1 font-bold">{s.promo.discount}</span> —{" "}
              <Link href={s.promo.link} className="underline underline-offset-4">
                {t("promo.shopNow")}
              </Link>
            </div>
          )}
          <Header siteName={s.siteName} categories={categories.map(({ id, slug, name }) => ({ id, slug, name }))} />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <footer className="mt-24 border-t border-line bg-card">
            <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4">
              <div>
                <h4 className="gold-text mb-4 font-display text-2xl uppercase tracking-[0.2em]" dir="ltr">{s.siteName}</h4>
                <p className="text-sm leading-relaxed text-foreground/60">{s.about}</p>
              </div>
              <div>
                <h4 className="eyebrow mb-4">{t("footer.policies")}</h4>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li><Link className="link-u" href="/pages/privacy-policy">{t("footer.privacy")}</Link></li>
                  <li><Link className="link-u" href="/pages/delivery-returns">{t("footer.returns")}</Link></li>
                  <li><Link className="link-u" href="/pages/terms-conditions">{t("footer.terms")}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="eyebrow mb-4">{t("footer.contact")}</h4>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>{s.contact.email}</li>
                  <li dir="ltr" className="text-start rtl:text-right">{s.contact.phone}</li>
                  <li><a href={s.contact.whatsapp} className="link-u">{t("footer.whatsapp")}</a></li>
                </ul>
              </div>
              <div>
                <h4 className="eyebrow mb-4">{s.newsletter.title}</h4>
                <p className="mb-3 text-sm text-foreground/60">
                  {t("footer.useCode")} <strong className="text-gold">{s.newsletter.code}</strong>
                </p>
                <form className="flex">
                  <input type="email" placeholder={t("footer.yourEmail")} className="field" />
                  <button type="button" className="btn">{t("footer.join")}</button>
                </form>
                <div className="mt-5 flex gap-4 text-xs uppercase tracking-widest text-foreground/60">
                  <a className="link-u" href={s.social.facebook}>Facebook</a>
                  <a className="link-u" href={s.social.instagram}>Instagram</a>
                  <a className="link-u" href={s.social.youtube}>YouTube</a>
                </div>
              </div>
            </div>
            <p className="border-t border-line py-5 text-center text-xs text-foreground/40">
              © {new Date().getFullYear()} {s.siteName}. {t("footer.demo")}
            </p>
          </footer>
        </div>
      </CartProvider>
      </AccountProvider>
    </LocaleProvider>
  );
}
