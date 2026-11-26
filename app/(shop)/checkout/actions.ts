"use server";
import { api, ApiError, errorMessage } from "@/lib/api/client";
import { accessToken } from "@/lib/session";
import type { Payment, PaymentMethod } from "@/lib/types";

type Raw = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const toPayment = (p: Raw): Payment => ({
  id: p.id, order: p.order, orderStatus: p.order_status, provider: p.provider, amount: p.amount,
  status: p.status, checkoutUrl: p.checkout_url ?? "", createdAt: p.created_at,
});

/** Calls the API as the signed-in shopper when there is one; falls back to a guest call if the token is rejected. */
async function asShopper<T>(path: string, body: unknown): Promise<T> {
  const token = await accessToken("shop");
  try {
    return await api<T>(path, { method: "POST", body, token });
  } catch (e) {
    if (token && e instanceof ApiError && e.status === 401) return api<T>(path, { method: "POST", body });
    throw e;
  }
}

export type PayResult = { ok: true; order: string; checkoutUrl: string } | { ok: false; order?: string; error: string };

/** Starts a payment for an existing order and returns the provider page to redirect to. */
export async function startPayment(order: string, provider: PaymentMethod["code"]): Promise<PayResult> {
  try {
    const p = await asShopper<Raw>("/payments/", { order, provider });
    return { ok: true, order, checkoutUrl: p.checkout_url };
  } catch (e) {
    return { ok: false, order, error: errorMessage(e, "The payment could not be started.") };
  }
}

/**
 * Creates the order (server-side prices, stock reserved) then the payment. If the payment cannot start, the order
 * stays saved and its number is returned so the form can retry the payment without creating a second order.
 */
export async function placeOrderAndPay(input: {
  customer: { name: string; email: string; phone: string; address: string };
  items: { productId: string; qty: number; variant?: string; color?: string }[];
  provider: PaymentMethod["code"];
}): Promise<PayResult> {
  const items = input.items.map((i) => ({ product: Number(i.productId), qty: i.qty, variant: i.variant, color: i.color }));
  if (!items.length || items.some((i) => !Number.isInteger(i.product))) {
    return { ok: false, error: "Your cart is out of date. Please add the items again." };
  }
  let order: string;
  try {
    order = (await asShopper<Raw>("/orders/", { customer: input.customer, items })).number;
  } catch (e) {
    return { ok: false, error: errorMessage(e, "The order could not be placed.") };
  }
  return startPayment(order, input.provider);
}

/** Status of a payment (the API re-checks pending ones with the provider). The UUID is the capability. */
export async function getPayment(id: string): Promise<Payment | null> {
  try {
    return toPayment(await api<Raw>(`/payments/${encodeURIComponent(id)}/`));
  } catch {
    return null;
  }
}
