import Link from "next/link";
import { getI18n, readLocalizedDB } from "@/lib/i18n/server";
import ProductImage from "@/components/ProductImage";
import Reveal from "@/components/Reveal";

export default async function Collections() {
  const [{ categories }, { t }] = await Promise.all([readLocalizedDB(), getI18n()]);
  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <Reveal className="mb-12 text-center">
        <p className="eyebrow mb-3">{t("categories.eyebrow")}</p>
        <h1 className="font-display text-5xl">{t("categories.title")}</h1>
      </Reveal>
      <div className="grid gap-5 md:grid-cols-2">
        {categories.map((c, i) => (
          <Reveal key={c.id} delay={(i % 2) * 0.12}>
            <Link href={`/collections/${c.slug}`} className="group relative block aspect-[16/10] overflow-hidden">
              <ProductImage src={c.image} name={c.name} sizes="(min-width: 768px) 50vw, 100vw" className="transition duration-[1200ms] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-3xl">{c.name}</h3>
                <p className="text-sm text-foreground/70">{c.description}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
