import type { Category, Product } from "@/lib/types";
import { saveProduct } from "../actions";
import { Button, FormSection, LinkButton } from "@/components/admin/ui";
import TrFields from "@/components/admin/TrFields";

export default function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  return (
    <form action={saveProduct} className="grid gap-4 xl:grid-cols-3">
      <input type="hidden" name="id" defaultValue={product?.id ?? ""} />

      <div className="grid gap-4 xl:col-span-2">
        <FormSection title="Informations générales" description="Nom, catégorie et description affichés sur la boutique.">
          <div>
            <label className="label">Nom</label>
            <input name="name" required defaultValue={product?.name} className="input" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Slug (optionnel)</label>
              <input name="slug" defaultValue={product?.slug} className="input" />
            </div>
            <div>
              <label className="label">Catégorie</label>
              <select name="categorySlug" defaultValue={product?.categorySlug} className="input">
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" rows={5} defaultValue={product?.description} className="input" />
          </div>
        </FormSection>

        <FormSection title="Traductions" description="Facultatif : si un champ est vide, le texte anglais est utilisé.">
          <TrFields
            tr={product?.tr}
            fields={[
              { key: "name", label: "Nom" },
              { key: "description", label: "Description", textarea: true, rows: 4 },
            ]}
          />
        </FormSection>

        <FormSection title="Tarification & stock">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label">Prix (CFA)</label>
              <input name="price" type="number" min={0} defaultValue={product?.price} className="input" />
            </div>
            <div>
              <label className="label">Prix barré</label>
              <input name="comparePrice" type="number" min={0} defaultValue={product?.comparePrice} className="input" />
            </div>
            <div>
              <label className="label">Stock</label>
              <input name="stock" type="number" min={0} defaultValue={product?.stock ?? 0} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Tailles — une par ligne « libellé:prix » (remplace le prix)</label>
            <textarea
              name="variants"
              rows={4}
              placeholder={"10GM:5000\n100GM:38000"}
              className="input font-mono"
              defaultValue={product?.variants.map((v) => `${v.label}:${v.price}`).join("\n")}
            />
          </div>
          <div>
            <label className="label">Couleurs (séparées par des virgules)</label>
            <input name="colors" defaultValue={product?.colors.join(", ")} className="input" />
          </div>
        </FormSection>
      </div>

      <div className="grid content-start gap-4">
        <FormSection title="Médias">
          <div>
            <label className="label">Image principale</label>
            <input name="image" defaultValue={product?.image} placeholder="/img/… ou https://…" className="input" />
          </div>
          <div>
            <label className="label">Image au survol</label>
            <input name="image2" defaultValue={product?.image2} className="input" />
          </div>
          {product?.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt="" className="aspect-square w-full rounded-lg object-cover" />
          )}
        </FormSection>

        <FormSection title="Visibilité">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={product?.published ?? true} className="size-4 accent-[var(--gold)]" />
            Publié sur la boutique
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} className="size-4 accent-[var(--gold)]" />
            Produit mis en avant
          </label>
        </FormSection>

        <div className="flex gap-2">
          <Button className="flex-1">Enregistrer</Button>
          <LinkButton href="/admin/products" variant="outline">Annuler</LinkButton>
        </div>
      </div>
    </form>
  );
}
