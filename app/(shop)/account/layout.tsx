import { redirect } from "next/navigation";
import AccountNav from "@/components/AccountNav";
import { getCustomer } from "@/lib/customer-auth";
import { getI18n } from "@/lib/i18n/server";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const me = await getCustomer();
  if (!me) redirect("/login?next=/account");
  const { t } = await getI18n();
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="eyebrow">{t("account.title")}</p>
      <h1 className="mb-8 mt-2 font-display text-5xl">{t("account.hello", { name: me.name.split(" ")[0] })}</h1>
      <AccountNav />
      {children}
    </div>
  );
}
