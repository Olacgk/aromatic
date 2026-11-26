import Flash from "@/components/admin/Flash";
import { readAdminDB } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/ui";
import ProductForm from "../ProductForm";

export default async function NewProduct({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const { categories } = await readAdminDB(["categories"]);
  return (
    <>
      <Flash error={error} />
      <PageHeader title="Nouveau produit" description="Ajoutez un produit au catalogue." />
      <ProductForm categories={categories} />
    </>
  );
}
