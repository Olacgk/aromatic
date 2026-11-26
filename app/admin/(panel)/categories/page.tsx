import Image from "next/image";
import { Trash2 } from "lucide-react";
import { readDB } from "@/lib/db";
import { deleteCategory, saveCategory } from "../actions";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader, buttonVariants } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import TrFields from "@/components/admin/TrFields";
import type { Category } from "@/lib/types";

function Fields({ c }: { c?: Category }) {
  return (
    <>
      <div><label className="label">Nom</label><input name="name" required defaultValue={c?.name} className="input" /></div>
      <div><label className="label">Slug</label><input name="slug" defaultValue={c?.slug} className="input" /></div>
      <div><label className="label">Image</label><input name="image" defaultValue={c?.image} className="input" /></div>
      <div><label className="label">Description</label><input name="description" defaultValue={c?.description} className="input" /></div>
      <div className="sm:col-span-2">
        <TrFields tr={c?.tr} fields={[{ key: "name", label: "Nom" }, { key: "description", label: "Description" }]} />
      </div>
    </>
  );
}

export default async function AdminCategories() {
  const { categories, products } = await readDB();
  return (
    <>
      <PageHeader title="Catégories" description="Organisez le catalogue en collections." />
      <div className="grid gap-4 xl:grid-cols-2">
        {categories.map((c) => {
          const used = products.filter((p) => p.categorySlug === c.slug).length;
          return (
            <Card key={c.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {c.image && <Image src={c.image} alt="" fill sizes="48px" className="object-cover" />}
                  </div>
                  <div>
                    <CardTitle>{c.name}</CardTitle>
                    <CardDescription>/collections/{c.slug}</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary">{used} produit{used > 1 ? "s" : ""}</Badge>
              </CardHeader>
              <CardContent>
                <form action={saveCategory} className="grid gap-3 sm:grid-cols-2">
                  <input type="hidden" name="id" value={c.id} />
                  <Fields c={c} />
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <Button size="sm">Enregistrer</Button>
                  </div>
                </form>
                <form action={deleteCategory} className="mt-3 border-t pt-3">
                  <input type="hidden" name="id" value={c.id} />
                  <ConfirmButton
                    message={`Supprimer la catégorie « ${c.name} » ?`}
                    disabled={used > 0}
                    className={cn(buttonVariants({ variant: "destructive", size: "sm" }))}
                  >
                    <Trash2 /> {used > 0 ? "Contient des produits" : "Supprimer"}
                  </ConfirmButton>
                </form>
              </CardContent>
            </Card>
          );
        })}

        <Card className="border-2 border-dashed ring-0">
          <CardHeader><CardTitle>Nouvelle catégorie</CardTitle></CardHeader>
          <CardContent>
            <form action={saveCategory} className="grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value="" />
              <Fields />
              <div className="sm:col-span-2"><Button size="sm">Ajouter</Button></div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
