"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "./LocaleProvider";

export type Slide = { image: string; eyebrow: string; title: string; text: string; href: string; cta: string };

export default function Hero({ slides }: { slides: Slide[] }) {
  const { t } = useI18n();
  const [i, setI] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setI((x) => (x + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const s = slides[i];
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="relative h-[88vh] min-h-[560px] overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={s.image}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2 }, scale: { duration: 9, ease: "linear" } }}
        >
          <Image src={s.image} alt={s.title} fill priority sizes="100vw" className="object-cover" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent rtl:bg-gradient-to-l" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            className="max-w-xl"
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }}
            variants={{ show: { transition: { staggerChildren: 0.15 } } }}
          >
            {[
              <p key="e" className="eyebrow">{s.eyebrow}</p>,
              <h1 key="t" className="font-display text-5xl leading-[1.05] md:text-7xl">{s.title}</h1>,
              <p key="p" className="max-w-md text-base text-foreground/75 md:text-lg">{s.text}</p>,
              <Link key="c" href={s.href} className="btn mt-2">{s.cta}</Link>,
            ].map((el, n) => (
              <motion.div
                key={n}
                className="mb-6"
                variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }}
              >
                {el}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
        {slides.map((_, n) => (
          <button
            key={n}
            aria-label={t("hero.slide", { n: n + 1 })}
            onClick={() => setI(n)}
            className="group relative h-6 w-10"
          >
            <span className="absolute inset-x-0 top-1/2 h-px bg-white/30" />
            <span
              className={`absolute start-0 top-1/2 h-px bg-gold transition-all duration-700 ${n === i ? "w-full" : "w-0"}`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
