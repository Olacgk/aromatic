import { notFound } from "next/navigation";
import { readDB } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import ProductForm from "../ProductForm";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { products, categories } = await readDB();
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  return (
    <>
      <PageHeader title={product.name} description="Modifier la fiche produit." />
      <ProductForm product={product} categories={categories} />
    </>
  );
}
