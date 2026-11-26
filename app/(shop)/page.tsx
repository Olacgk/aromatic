import Link from "next/link";
import { getI18n, readLocalizedDB } from "@/lib/i18n/server";
import Hero, { type Slide } from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ProductImage from "@/components/ProductImage";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import Parallax from "@/components/Parallax";
import CountUp from "@/components/CountUp";

export default async function Home() {
  const [{ categories, products, settings }, { t }] = await Promise.all([readLocalizedDB(), getI18n()]);
  const live = products.filter((p) => p.published);
  const by = (slug: string) => live.filter((p) => p.categorySlug === slug).slice(0, 4);
  const cat = (slug: string) => categories.find((c) => c.slug === slug);

  const slides: Slide[] = (
    [
      ["luxury-perfumes", "perfumes"],
      ["aroma-diffuser", "diffusers"],
      ["aromatic-oils", "oils"],
    ] as const
  ).flatMap(([slug, k]) => {
    const c = cat(slug);
    return c?.image
      ? [{
          image: c.image,
          eyebrow: t(`hero.${k}.eyebrow`),
          title: t(`hero.${k}.title`),
          text: t(`hero.${k}.text`),
          cta: t(`hero.${k}.cta`),
          href: `/collections/${slug}`,
        }]
      : [];
  });

  const feature = live.find((p) => p.slug === "af3000-pro") ?? live.find((p) => p.categorySlug === "aroma-diffuser");

  return (
    <>
      {slides.length > 0 && <Hero slides={slides} />}
      <Marquee items={[t("marquee.1"), t("marquee.2"), t("marquee.3"), t("marquee.4"), t("marquee.5")]} />

      <section className="mx-auto max-w-7xl px-5 py-20">
        <Reveal className="mb-12 text-center">
          <p className="eyebrow mb-3">{t("home.collections")}</p>
          <h2 className="font-display text-4xl md:text-5xl">{t("home.shopByCategory")}</h2>
          <div className="mx-auto mt-5 h-px w-16 bg-gold" />
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.12}>
              <Link href={`/collections/${c.slug}`} className="group relative block aspect-[3/4] overflow-hidden">
                <ProductImage src={c.image} name={c.name} className="transition duration-[1200ms] ease-out group-hover:scale-110" sizes="(min-width: 768px) 25vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent transition group-hover:from-black/70" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-2xl leading-tight">{c.name}</h3>
                  <span className="mt-2 inline-block translate-y-2 text-[0.7rem] uppercase tracking-[0.25em] text-gold opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {t("home.explore")} <span className="inline-block rtl:rotate-180">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <Section eyebrow={t("home.bestSellers")} title={cat("luxury-perfumes")?.name ?? ""} href="/collections/luxury-perfumes" products={by("luxury-perfumes")} />

      {feature && (
        <section className="grid bg-card md:grid-cols-2">
          <Parallax src={feature.image2 || feature.image} alt={feature.name} />
          <div className="flex items-center px-8 py-20 md:px-16">
            <Reveal>
              <p className="eyebrow mb-4">{t("home.professional")}</p>
              <h2 className="mb-5 font-display text-4xl leading-tight md:text-6xl">{feature.name}</h2>
              <p className="mb-8 max-w-md text-foreground/70">{feature.description}</p>
              <Link href={`/products/${feature.slug}`} className="btn">{t("home.discover")}</Link>
            </Reveal>
          </div>
        </section>
      )}

      <Section eyebrow={t("home.homeHotels")} title={cat("aroma-diffuser")?.name ?? ""} href="/collections/aroma-diffuser" products={by("aroma-diffuser")} />
      <Section eyebrow={t("home.refills")} title={cat("aromatic-oils")?.name ?? ""} href="/collections/aromatic-oils" products={by("aromatic-oils")} />

      <section className="relative overflow-hidden border-y border-line py-24 text-center">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <p className="eyebrow mb-4">{t("home.ourStory")}</p>
            <h2 className="mb-6 font-display text-4xl md:text-5xl">{t("home.about", { name: settings.siteName })}</h2>
            <p className="text-lg leading-relaxed text-foreground/70">{settings.about}</p>
          </Reveal>
        </div>
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-3 gap-6 px-5">
          {(
            [
              ["2017", t("home.stat.founded")],
              ["30", t("home.stat.fragrances")],
              ["100", t("home.stat.alcoholFree")],
            ] as const
          ).map(([n, l], i) => (
            <Reveal key={l} delay={i * 0.15}>
              <p className="gold-text font-display text-5xl md:text-7xl" dir="ltr">
                <CountUp to={Number(n)} />
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-foreground/50">{l}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
