import { readDB } from "@/lib/db";
import { savePage } from "../actions";
import TrFields from "@/components/admin/TrFields";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader } from "@/components/admin/ui";

export default async function AdminPages() {
  const { pages } = await readDB();
  return (
    <>
      <PageHeader title="Pages" description="Pages légales et d'information affichées dans le pied de page." />
      <div className="grid gap-4 xl:grid-cols-2">
        {pages.map((p) => (
          <Card key={p.slug}>
            <CardHeader>
              <div>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription className="font-mono text-xs">/pages/{p.slug}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form action={savePage} className="grid gap-3">
                <input type="hidden" name="slug" value={p.slug} />
                <div><label className="label">Titre</label><input name="title" defaultValue={p.title} className="input" /></div>
                <div><label className="label">Contenu</label><textarea name="content" rows={6} defaultValue={p.content} className="input" /></div>
                <TrFields tr={p.tr} fields={[{ key: "title", label: "Titre" }, { key: "content", label: "Contenu", textarea: true, rows: 5 }]} />
                <div><Button size="sm">Enregistrer</Button></div>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
