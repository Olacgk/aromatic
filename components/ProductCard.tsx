import Link from "next/link";
import type { Product } from "@/lib/types";
import { productFrom } from "@/lib/format";
import { getI18n } from "@/lib/i18n/server";
import FavoriteButton from "./FavoriteButton";
import ProductImage from "./ProductImage";

export default async function ProductCard({ p }: { p: Product }) {
  const { t, fmt } = await getI18n();
  const from = productFrom(p);
  const discount = p.comparePrice ? Math.round((1 - p.price / p.comparePrice) * 100) : 0;
  return (
    <div className="group relative">
    <Link href={`/products/${p.slug}`} className="block">
      <div className="relative aspect-[4/5] overflow-hidden bg-card">
        <ProductImage
          src={p.image}
          name={p.name}
          className={`transition duration-700 ease-out group-hover:scale-110 ${p.image2 ? "group-hover:opacity-0" : ""}`}
        />
        {p.image2 && (
          <ProductImage
            src={p.image2}
            name={p.name}
            className="scale-105 opacity-0 transition duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        {discount > 0 && (
          <span className="absolute start-3 top-3 bg-gold px-2.5 py-1 text-[0.65rem] font-bold tracking-widest text-black">
            -{discount}%
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gold py-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-black transition duration-500 group-hover:translate-y-0">
          {t("card.view")}
        </span>
      </div>
      <div className="mt-4 text-center">
        <h3 className="font-display text-xl tracking-wide transition group-hover:text-gold">{p.name}</h3>
        <p className="mt-1 text-sm text-foreground/60">
          {p.variants.length > 0 && `${t("card.from")} `}
          <span className="text-gold">{fmt(from)}</span>
          {p.comparePrice && <span className="ms-2 text-foreground/35 line-through">{fmt(p.comparePrice)}</span>}
        </p>
        {p.colors.length > 0 && <p className="mt-1 text-xs text-foreground/40">{p.colors.join(" · ")}</p>}
      </div>
    </Link>
    <FavoriteButton productId={p.id} className="absolute end-3 top-3 z-10" />
    </div>
  );
}
