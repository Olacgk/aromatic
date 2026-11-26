import Link from "next/link";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { getI18n } from "@/lib/i18n/server";

export default async function Section({
  eyebrow,
  title,
  href,
  products,
}: {
  eyebrow?: string;
  title: string;
  href: string;
  products: Product[];
}) {
  if (!products.length) return null;
  const { t } = await getI18n();
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
      <Reveal className="mb-12 text-center">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="font-display text-4xl md:text-5xl">{title}</h2>
        <div className="mx-auto mt-5 h-px w-16 bg-gold" />
      </Reveal>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 0.1}>
            <ProductCard p={p} />
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-12 text-center">
        <Link href={href} className="btn-outline">
          {t("section.viewAll")}
        </Link>
      </Reveal>
    </section>
  );
}
