import type { OrderStatus } from "./types";

type Variant = "warning" | "info" | "success" | "secondary" | "destructive";

const MAP: Record<OrderStatus, { label: string; variant: Variant }> = {
  pending: { label: "En attente", variant: "warning" },
  paid: { label: "Payée", variant: "info" },
  shipped: { label: "Expédiée", variant: "secondary" },
  delivered: { label: "Livrée", variant: "success" },
  cancelled: { label: "Annulée", variant: "destructive" },
};

export const ORDER_STATUSES = Object.keys(MAP) as OrderStatus[];
export const orderStatus = (s: OrderStatus) => MAP[s];
