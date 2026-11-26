import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { readDB } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { deleteProduct } from "../actions";
import ConfirmButton from "@/components/admin/ConfirmButton";
import {
  Badge, Card, CardContent, DataTable, LinkButton, PageHeader, THead, Td, Th, buttonVariants,
} from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export default async function AdminProducts() {
  const { products, categories } = await readDB();
  const catName = (s: string) => categories.find((c) => c.slug === s)?.name ?? s;
  return (
    <>
      <PageHeader
        title="Produits"
        description={`${products.length} produits dans le catalogue.`}
        actions={
          <LinkButton href="/admin/products/new" size="sm">
            <Plus /> Nouveau produit
          </LinkButton>
        }
      />
      <Card className="py-0">
        <CardContent className="px-0">
          <DataTable className="min-w-[44rem]">
            <THead>
              <Th>Produit</Th><Th>Catégorie</Th><Th>Prix</Th><Th>Stock</Th><Th>Statut</Th><Th className="text-right">Actions</Th>
            </THead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                        {p.image && <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{p.name}</p>
                        <p className="truncate font-mono text-xs text-muted-foreground">{p.slug}</p>
                      </div>
                    </div>
                  </Td>
                  <Td><Badge variant="outline" className="font-normal">{catName(p.categorySlug)}</Badge></Td>
                  <Td>
                    {p.variants.length > 0 && <span className="text-xs text-muted-foreground">dès </span>}
                    {formatPrice(p.price)}
                    {p.comparePrice && <span className="ml-1.5 text-xs text-muted-foreground line-through">{formatPrice(p.comparePrice)}</span>}
                  </Td>
                  <Td>
                    <Badge variant={p.stock === 0 ? "destructive" : p.stock <= 5 ? "warning" : "secondary"}>{p.stock}</Badge>
                  </Td>
                  <Td><Badge variant={p.published ? "success" : "secondary"}>{p.published ? "Publié" : "Brouillon"}</Badge></Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1">
                      <LinkButton href={`/admin/products/${p.id}`} variant="ghost" size="icon-sm" aria-label="Modifier">
                        <Pencil />
                      </LinkButton>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={p.id} />
                        <ConfirmButton
                          message={`Supprimer « ${p.name} » ? Cette action est définitive.`}
                          aria-label="Supprimer"
                          className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-destructive hover:bg-destructive/10")}
                        >
                          <Trash2 />
                        </ConfirmButton>
                      </form>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </CardContent>
      </Card>
    </>
  );
}
