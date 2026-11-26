import { notFound } from "next/navigation";
import { getI18n, readLocalizedDB } from "@/lib/i18n/server";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export default async function Collection({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { slug } = await params;
  const { sort } = await searchParams;
  const [{ categories, products }, { t }] = await Promise.all([readLocalizedDB(), getI18n()]);

  let title: string;
  let description = "";
  let list = products.filter((p) => p.published);

  if (slug === "all") title = t("collection.all");
  else if (slug === "sale") {
    title = t("collection.sale");
    list = list.filter((p) => p.comparePrice);
  } else {
    const c = categories.find((x) => x.slug === slug);
    if (!c) notFound();
    title = c.name;
    description = c.description;
    list = list.filter((p) => p.categorySlug === slug);
  }

  if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <Reveal className="mb-12 text-center">
        <p className="eyebrow mb-3">{t("collection.eyebrow")}</p>
        <h1 className="font-display text-5xl">{title}</h1>
        {description && <p className="mt-3 text-foreground/60">{description}</p>}
        <div className="mx-auto mt-5 h-px w-16 bg-gold" />
      </Reveal>
      <form className="mb-10 flex items-center justify-between gap-3 border-y border-line py-4 text-sm">
        <span className="text-foreground/50">{t("collection.count", { n: list.length })}</span>
        <div className="flex items-center gap-2">
          <select name="sort" defaultValue={sort ?? ""} className="field w-auto">
            <option value="">{t("collection.featured")}</option>
            <option value="price-asc">{t("collection.priceAsc")}</option>
            <option value="price-desc">{t("collection.priceDesc")}</option>
          </select>
          <button className="btn-outline !py-3">{t("collection.sort")}</button>
        </div>
      </form>
      {list.length === 0 ? (
        <p className="text-center text-foreground/50">{t("collection.none")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.08}>
              <ProductCard p={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
