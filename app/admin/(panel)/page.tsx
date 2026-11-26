import Link from "next/link";
import { AlertTriangle, CircleDollarSign, FolderTree, Package, ShoppingBag } from "lucide-react";
import { readDB } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { orderStatus } from "@/lib/order-status";
import {
  Badge, Card, CardContent, CardDescription, CardHeader, CardTitle,
  DataTable, LinkButton, PageHeader, StatCard, THead, Td, Th,
} from "@/components/admin/ui";

export default async function Dashboard() {
  const { products, orders, categories } = await readDB();
  const live = orders.filter((o) => o.status !== "cancelled");
  const revenue = live.reduce((n, o) => n + o.total, 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const low = products.filter((p) => p.stock <= 5);
  const drafts = products.filter((p) => !p.published).length;
  const max = Math.max(1, ...categories.map((c) => products.filter((p) => p.categorySlug === c.slug).length));

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Vue d'ensemble du catalogue, des commandes et du stock."
        actions={<LinkButton href="/admin/products/new" size="sm">Nouveau produit</LinkButton>}
      />

      <section aria-label="Indicateurs clés" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Produits" value={products.length} hint={drafts ? `${drafts} brouillon(s)` : "Tous publiés"} icon={Package} />
        <StatCard label="Catégories" value={categories.length} hint="Dans le catalogue" icon={FolderTree} />
        <StatCard label="Commandes" value={orders.length} hint={pending ? `${pending} en attente` : "Aucune en attente"} tone={pending ? "warning" : "neutral"} icon={ShoppingBag} />
        <StatCard label="Chiffre d'affaires" value={formatPrice(revenue)} hint="Hors commandes annulées" tone="success" icon={CircleDollarSign} />
      </section>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Commandes récentes</CardTitle>
              <CardDescription>Les dernières commandes passées sur la boutique</CardDescription>
            </div>
            <LinkButton href="/admin/orders" variant="ghost" size="xs">Tout voir</LinkButton>
          </CardHeader>
          <CardContent className="px-0">
            {orders.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground">Aucune commande pour le moment.</p>
            ) : (
              <DataTable>
                <THead>
                  <Th>Commande</Th><Th>Client</Th><Th>Statut</Th><Th className="text-right">Total</Th>
                </THead>
                <tbody>
                  {orders.slice(0, 6).map((o) => {
                    const s = orderStatus(o.status);
                    return (
                      <tr key={o.id} className="border-b last:border-0">
                        <Td className="font-mono text-xs text-muted-foreground">{o.id}</Td>
                        <Td className="font-medium">{o.customer.name}</Td>
                        <Td><Badge variant={s.variant}>{s.label}</Badge></Td>
                        <Td className="text-right">{formatPrice(o.total)}</Td>
                      </tr>
                    );
                  })}
                </tbody>
              </DataTable>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Stock bas</CardTitle>
              <CardDescription>Produits à réapprovisionner (≤ 5)</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {low.length === 0 ? (
              <p className="text-sm text-muted-foreground">Rien à signaler.</p>
            ) : (
              <ul className="space-y-3">
                {low.map((p) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <AlertTriangle className="size-4 shrink-0 text-amber-500" aria-hidden />
                    <Link href={`/admin/products/${p.id}`} className="min-w-0 flex-1 truncate text-sm font-medium hover:underline">
                      {p.name}
                    </Link>
                    <Badge variant={p.stock === 0 ? "destructive" : "warning"}>{p.stock} restant</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Produits par catégorie</CardTitle>
              <CardDescription>Répartition du catalogue</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.map((c) => {
              const n = products.filter((p) => p.categorySlug === c.slug).length;
              return (
                <div key={c.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-muted-foreground">{n}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted">
                    <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${(n / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Statut des commandes</CardTitle>
              <CardDescription>Répartition actuelle</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {(["pending", "paid", "shipped", "delivered", "cancelled"] as const).map((k) => {
                const s = orderStatus(k);
                return (
                  <li key={k} className="flex items-center justify-between py-2.5">
                    <Badge variant={s.variant} className="min-w-24">{s.label}</Badge>
                    <span className="text-sm font-medium">{orders.filter((o) => o.status === k).length}</span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
