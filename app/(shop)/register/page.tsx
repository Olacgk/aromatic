import { redirect } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import { getCustomer, safeNext } from "@/lib/customer-auth";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const { error, next } = await searchParams;
  if (await getCustomer()) redirect(safeNext(next));
  return <AuthCard mode="register" error={error} next={next} />;
}
