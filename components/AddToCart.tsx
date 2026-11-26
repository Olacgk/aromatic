"use client";
import { useState } from "react";
import { motion } from "motion/react";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";
import { useI18n } from "./LocaleProvider";

export default function AddToCart({ p }: { p: Product }) {
  const { add, setOpen } = useCart();
  const { t, fmt } = useI18n();
  const [variant, setVariant] = useState(p.variants[0]?.label);
  const [color, setColor] = useState(p.colors[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const price = p.variants.find((v) => v.label === variant)?.price ?? p.price;
  const out = p.stock <= 0;

  const chip = (active: boolean) =>
    `border px-4 py-2 text-xs uppercase tracking-widest transition ${
      active ? "border-gold bg-gold text-black" : "border-line hover:border-gold"
    }`;

  return (
    <div className="space-y-6">
      <motion.p key={price} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl text-gold">
        {fmt(price)}
        {p.comparePrice && !p.variants.length && (
          <span className="ms-3 text-lg text-foreground/35 line-through">{fmt(p.comparePrice)}</span>
        )}
      </motion.p>
      {p.variants.length > 0 && (
        <div>
          <span className="label">{t("product.size")}</span>
          <div className="flex flex-wrap gap-2">
            {p.variants.map((v) => (
              <button key={v.label} onClick={() => setVariant(v.label)} className={chip(variant === v.label)}>
                {v.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {p.colors.length > 0 && (
        <div>
          <span className="label">{t("product.color")}</span>
          <div className="flex flex-wrap gap-2">
            {p.colors.map((c) => (
              <button key={c} onClick={() => setColor(c)} className={chip(color === c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-stretch gap-3">
        <div className="flex items-center border border-line">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-full px-4 hover:text-gold">−</button>
          <span className="w-8 text-center text-sm">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="h-full px-4 hover:text-gold">+</button>
        </div>
        <button
          className="btn flex-1"
          disabled={out}
          onClick={() => {
            add({ productId: p.id, slug: p.slug, name: p.name, variant, color, price }, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
            setOpen(true);
          }}
        >
          {out ? t("product.soldOut") : added ? t("product.added") : t("product.add")}
        </button>
      </div>
    </div>
  );
}
