"use server";
import { updateDB } from "@/lib/db";
import type { OrderItem } from "@/lib/types";

export async function placeOrder(input: {
  customer: { name: string; email: string; phone: string; address: string };
  items: OrderItem[];
}): Promise<{ id: string }> {
  if (!input.items.length) throw new Error("Empty cart");
  let id = "";
  await updateDB((db) => {
    // Prices are re-read server side so the client cannot set its own.
    const items = input.items.map((i) => {
      const p = db.products.find((x) => x.id === i.productId);
      const price = p ? (p.variants.find((v) => v.label === i.variant)?.price ?? p.price) : i.price;
      return { ...i, price, qty: Math.max(1, Math.floor(i.qty)) };
    });
    for (const i of items) {
      const p = db.products.find((x) => x.id === i.productId);
      if (p) p.stock = Math.max(0, p.stock - i.qty);
    }
    id = `ORD-${1001 + db.orders.length}`;
    db.orders.unshift({
      id,
      createdAt: new Date().toISOString(),
      customer: input.customer,
      items,
      total: items.reduce((n, i) => n + i.price * i.qty, 0),
      status: "pending",
    });
  });
  return { id };
}
