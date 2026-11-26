import { redirect } from "next/navigation";
import { getPaymentMethods } from "@/lib/api/store";
import ResultView from "./ResultView";

/** Where Wave / Orange Money / the card page send the customer back to. `payment` is the payment UUID. */
export default async function ResultPage({ searchParams }: { searchParams: Promise<{ payment?: string; outcome?: string }> }) {
  const { payment } = await searchParams;
  if (!payment || !/^[0-9a-f-]{32,36}$/i.test(payment)) redirect("/");
  return <ResultView paymentId={payment} methods={await getPaymentMethods()} />;
}
