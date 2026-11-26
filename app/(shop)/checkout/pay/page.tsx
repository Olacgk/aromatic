import { redirect } from "next/navigation";
import { getPaymentMethods } from "@/lib/api/store";
import PayForm from "./PayForm";

/** Retry the payment of an order that was placed but not paid (linked from the account page and the result page). */
export default async function PayPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  if (!order || !/^ORD-\d+$/.test(order)) redirect("/account");
  return <PayForm order={order} methods={await getPaymentMethods()} />;
}
