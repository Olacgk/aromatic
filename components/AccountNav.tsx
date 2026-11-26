"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/(shop)/account/actions";
import { useI18n } from "./LocaleProvider";
import { useAccount } from "./AccountProvider";

export default function AccountNav() {
  const path = usePathname();
  const { t } = useI18n();
  const { favorites } = useAccount();
  const tab = (href: string, active: boolean) =>
    `border-b-2 pb-3 text-xs uppercase tracking-[0.2em] transition ${active ? "border-gold text-gold" : "border-transparent hover:text-gold"}`;
  return (
    <nav className="mb-10 flex flex-wrap items-center gap-8 border-b border-line">
      <Link href="/account" className={tab("/account", path === "/account")}>{t("account.orders")}</Link>
      <Link href="/account/favorites" className={tab("/account/favorites", path === "/account/favorites")}>
        {t("account.favorites")} ({favorites.length})
      </Link>
      <form action={logout} className="ms-auto pb-3">
        <button className="text-xs uppercase tracking-[0.2em] text-foreground/60 transition hover:text-gold">{t("account.logout")}</button>
      </form>
    </nav>
  );
}
