import { getCustomer } from "@/lib/customer-auth";
import { getPaymentMethods } from "@/lib/api/store";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage() {
  const [c, methods] = await Promise.all([getCustomer(), getPaymentMethods()]);
  return (
    <CheckoutForm
      me={c ? { name: c.name, email: c.email, phone: c.phone ?? "", address: c.address ?? "" } : null}
      methods={methods}
    />
  );
}
