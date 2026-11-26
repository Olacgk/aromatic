import { notFound } from "next/navigation";
import { readLocalizedDB } from "@/lib/i18n/server";

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { pages } = await readLocalizedDB();
  const page = pages.find((p) => p.slug === slug);
  if (!page) notFound();
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="mb-8 font-display text-5xl">{page.title}</h1>
      <div className="space-y-4 whitespace-pre-line leading-relaxed text-foreground/70">{page.content}</div>
    </div>
  );
}
