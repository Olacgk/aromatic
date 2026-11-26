import Flash from "@/components/admin/Flash";
import { Mail, MapPin, Phone } from "lucide-react";
import { readAdminDB } from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUSES, orderStatus } from "@/lib/order-status";
import { setOrderStatus } from "../actions";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, PageHeader } from "@/components/admin/ui";

export default async function AdminOrders({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const { orders } = await readAdminDB(["orders"]);
  return (
    <>
      <Flash error={error} />
      <PageHeader title="Commandes" description={`${orders.length} commande(s) au total.`} />
      {orders.length === 0 && <p className="text-sm text-muted-foreground">Aucune commande pour le moment.</p>}
      <div className="grid gap-4 xl:grid-cols-2">
        {orders.map((o) => {
          const s = orderStatus(o.status);
          return (
            <Card key={o.id}>
              <CardHeader>
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <span className="font-mono">{o.id}</span>
                    <Badge variant={s.variant}>{s.label}</Badge>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString("fr-FR")}</p>
                </div>
                <p className="text-lg font-semibold">{formatPrice(o.total)}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{o.customer.name}</p>
                  <p className="flex items-center gap-2 text-muted-foreground"><Mail className="size-3.5" />{o.customer.email}</p>
                  <p className="flex items-center gap-2 text-muted-foreground"><Phone className="size-3.5" />{o.customer.phone}</p>
                  <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="size-3.5" />{o.customer.address}</p>
                </div>
                <ul className="divide-y rounded-lg border text-sm">
                  {o.items.map((i, n) => (
                    <li key={n} className="flex items-center justify-between gap-3 px-3 py-2">
                      <span>
                        {i.qty} × {i.name}
                        <span className="text-muted-foreground"> {[i.variant, i.color].filter(Boolean).join(" · ")}</span>
                      </span>
                      <span>{formatPrice(i.price * i.qty)}</span>
                    </li>
                  ))}
                </ul>
                <form action={setOrderStatus} className="flex gap-2">
                  <input type="hidden" name="id" value={o.id} />
                  <select name="status" defaultValue={o.status} className="input">
                    {ORDER_STATUSES.map((k) => (
                      <option key={k} value={k}>{orderStatus(k).label}</option>
                    ))}
                  </select>
                  <Button variant="outline">Mettre à jour</Button>
                </form>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
