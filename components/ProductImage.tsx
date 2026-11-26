import Image from "next/image";

const PALETTE = ["#3a2d1c", "#4a3820", "#2d2417", "#5a4426"];

export default function ProductImage({
  src,
  name,
  className = "",
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority = false,
}: {
  src?: string;
  name: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!src) {
    const i = [...name].reduce((n, c) => n + c.charCodeAt(0), 0) % PALETTE.length;
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center font-display text-5xl text-gold/70 ${className}`}
        style={{ background: `linear-gradient(135deg, ${PALETTE[i]}, #15120e)` }}
        aria-label={name}
      >
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={name}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={src.startsWith("http")}
      className={`object-cover ${className}`}
    />
  );
}
