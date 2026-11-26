import Link from "next/link";
import { notFound } from "next/navigation";
import { getI18n, readLocalizedDB } from "@/lib/i18n/server";
import AddToCart from "@/components/AddToCart";
import Gallery from "@/components/Gallery";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{ products, categories }, { t, fmt }] = await Promise.all([readLocalizedDB(), getI18n()]);
  const p = products.find((x) => x.slug === slug && x.published);
  if (!p) notFound();
  const cat = categories.find((c) => c.slug === p.categorySlug);
  const related = products.filter((x) => x.published && x.categorySlug === p.categorySlug && x.id !== p.id).slice(0, 4);
  const images = [p.image, p.image2].filter((x): x is string => Boolean(x));

  return (
    <>
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-12 md:grid-cols-2">
        <Gallery images={images} name={p.name} />
        <Reveal className="md:pt-8">
          {cat && (
            <Link href={`/collections/${cat.slug}`} className="eyebrow link-u">
              {cat.name}
            </Link>
          )}
          <h1 className="mb-6 mt-3 font-display text-5xl">{p.name}</h1>
          <AddToCart p={p} />
          <p className="mt-8 border-t border-line pt-6 leading-relaxed text-foreground/70">{p.description}</p>
          <p className="mt-4 text-xs uppercase tracking-widest text-foreground/40">
            {p.stock > 0 ? t("product.inStock", { n: p.stock }) : t("product.outOfStock")} ·{" "}
            {t("product.delivery").replace("CFA50,000", fmt(50000))}
          </p>
        </Reveal>
      </div>
      <Section eyebrow={t("section.relatedEyebrow")} title={t("section.related")} href={cat ? `/collections/${cat.slug}` : "/collections/all"} products={related} />
    </>
  );
}
