"use client";
import { useAccount } from "./AccountProvider";
import { useI18n } from "./LocaleProvider";

export default function FavoriteButton({ productId, className = "" }: { productId: string; className?: string }) {
  const { isFavorite, toggle } = useAccount();
  const { t } = useI18n();
  const on = isFavorite(productId);
  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      aria-pressed={on}
      aria-label={on ? t("fav.remove") : t("fav.add")}
      title={on ? t("fav.remove") : t("fav.add")}
      className={`flex size-9 items-center justify-center rounded-full bg-black/55 backdrop-blur transition hover:scale-110 hover:bg-black/75 ${className}`}
    >
      <svg viewBox="0 0 24 24" className={`size-[1.1rem] transition ${on ? "fill-gold stroke-gold" : "fill-none stroke-white"}`} strokeWidth="1.8">
        <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.9 4.8 6.4 4.8c2 0 3.6 1.1 5.6 3.2 2-2.1 3.6-3.2 5.6-3.2 3.5 0 5.5 3.6 4 7C19.5 16.4 12 21 12 21z" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
