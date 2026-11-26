import { getI18n, readLocalizedDB } from "@/lib/i18n/server";
import ProductCard from "@/components/ProductCard";

export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const [{ products }, { t }] = await Promise.all([readLocalizedDB(), getI18n()]);
  const term = q.trim().toLowerCase();
  const list = term
    ? products.filter((p) => p.published && (p.name + " " + p.description).toLowerCase().includes(term))
    : [];
  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <h1 className="mb-8 text-center font-display text-5xl">{t("search.title")}{q && `: “${q}”`}</h1>
      <form className="mx-auto mb-12 flex max-w-lg">
        <input name="q" defaultValue={q} className="field" placeholder={t("search.products")} />
        <button className="btn">{t("search.button")}</button>
      </form>
      {term && list.length === 0 && <p className="text-center text-foreground/50">{t("search.none")}</p>}
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
