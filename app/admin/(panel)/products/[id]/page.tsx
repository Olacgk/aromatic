import Flash from "@/components/admin/Flash";
import { notFound } from "next/navigation";
import { readAdminDB } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/ui";
import ProductForm from "../ProductForm";

export default async function EditProduct({
  params, searchParams,
}: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  const { products, categories } = await readAdminDB(["products", "categories"]);
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  return (
    <>
      <Flash error={error} />
      <PageHeader title={product.name} description="Modifier la fiche produit." />
      <ProductForm product={product} categories={categories} />
    </>
  );
}
