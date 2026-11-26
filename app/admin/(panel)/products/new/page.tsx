import { readDB } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import ProductForm from "../ProductForm";

export default async function NewProduct() {
  const { categories } = await readDB();
  return (
    <>
      <PageHeader title="Nouveau produit" description="Ajoutez un produit au catalogue." />
      <ProductForm categories={categories} />
    </>
  );
}
