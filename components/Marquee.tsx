export default function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee overflow-hidden border-y border-line bg-card py-5">
      <div className="marquee-track flex w-max whitespace-nowrap">
        {[...row, ...row].map((t, i) => (
          <span key={i} className="flex items-center font-display text-2xl italic text-foreground/70">
            {t}
            <span className="mx-8 text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
