import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getCustomer } from "@/lib/customer-auth";
import { getI18n, readLocalizedDB } from "@/lib/i18n/server";

export default async function FavoritesPage() {
  const [me, { products }, { t }] = await Promise.all([getCustomer(), readLocalizedDB(), getI18n()]);
  const list = (me?.favorites ?? [])
    .map((id) => products.find((p) => p.id === id && p.published))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (!list.length)
    return (
      <div className="py-10 text-center">
        <p className="mb-5 text-foreground/60">{t("account.noFavorites")}</p>
        <Link href="/collections/all" className="btn">{t("checkout.shop")}</Link>
      </div>
    );
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {list.map((p) => <ProductCard key={p.id} p={p} />)}
    </div>
  );
}
