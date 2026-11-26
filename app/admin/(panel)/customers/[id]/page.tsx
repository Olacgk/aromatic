import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Ban, CheckCircle2, CircleDollarSign, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { readAdminDB } from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";
import { orderStatus } from "@/lib/order-status";
import { deleteCustomer, saveCustomer, setCustomerBlocked } from "../../actions";
import ConfirmButton from "@/components/admin/ConfirmButton";
import {
  Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader, StatCard, buttonVariants,
} from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export default async function AdminCustomer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { customers, orders, products } = await readAdminDB(["customers", "orders", "products"]);
  const c = customers.find((x) => x.id === id);
  if (!c) notFound();
  const mine = orders.filter((o) => o.customerId === c.id);
  const spent = mine.filter((o) => o.status !== "cancelled").reduce((n, o) => n + o.total, 0);
  const favs = c.favorites.map((fid) => products.find((p) => p.id === fid)).filter((p) => p !== undefined);

  return (
    <>
      <PageHeader
        title={c.name}
        description={c.email}
        actions={c.blocked ? <Badge variant="destructive">Suspendu</Badge> : <Badge variant="success">Actif</Badge>}
      />
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Commandes" value={mine.length} hint="Depuis ce compte" icon={ShoppingBag} />
        <StatCard label="Total dépensé" value={formatPrice(spent)} hint="Hors commandes annulées" tone="success" icon={CircleDollarSign} />
        <StatCard label="Favoris" value={favs.length} hint="Produits sauvegardés" icon={Heart} />
      </section>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="grid content-start gap-4 xl:col-span-2">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Historique des commandes</CardTitle>
                <CardDescription>Commandes passées depuis ce compte</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              {mine.length === 0 ? (
                <p className="px-4 text-sm text-muted-foreground">Aucune commande.</p>
              ) : (
                <ul className="divide-y">
                  {mine.map((o) => {
                    const s = orderStatus(o.status);
                    return (
                      <li key={o.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                        <div>
                          <span className="font-mono">{o.id}</span>
                          <p className="text-xs text-muted-foreground">
                            {new Date(o.createdAt).toLocaleString("fr-FR")} · {o.items.reduce((n, i) => n + i.qty, 0)} article(s)
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={s.variant}>{s.label}</Badge>
                          <span className="w-28 text-right font-medium">{formatPrice(o.total)}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              <p className="px-4 pt-3 text-xs text-muted-foreground">
                Le statut se modifie depuis <Link href="/admin/orders" className="underline">Commandes</Link>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Favoris</CardTitle></CardHeader>
            <CardContent>
              {favs.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun favori.</p>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {favs.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 text-sm">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />
                      </div>
                      <Link href={`/admin/products/${p.id}`} className="hover:underline">{p.name}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid content-start gap-4">
          <Card>
            <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
            <CardContent>
              <form action={saveCustomer} className="grid gap-3">
                <input type="hidden" name="id" value={c.id} />
                <div><label className="label">Nom</label><input name="name" required defaultValue={c.name} className="input" /></div>
                <div><label className="label">Téléphone</label><input name="phone" defaultValue={c.phone ?? ""} className="input" /></div>
                <div><label className="label">Adresse</label><textarea name="address" rows={3} defaultValue={c.address ?? ""} className="input" /></div>
                <p className="text-xs text-muted-foreground">
                  Inscrit le {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                  {c.lastLoginAt && ` · dernière connexion ${new Date(c.lastLoginAt).toLocaleDateString("fr-FR")}`}
                  {" · "}{[c.hasGoogle && "Google", c.hasPassword && "Email"].filter(Boolean).join(" + ")}
                </p>
                <div><Button size="sm">Enregistrer</Button></div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Accès au compte</CardTitle>
                <CardDescription>Un compte suspendu ne peut plus se connecter.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              <form action={setCustomerBlocked}>
                <input type="hidden" name="id" value={c.id} />
                <input type="hidden" name="blocked" value={c.blocked ? "0" : "1"} />
                <Button variant="outline" size="sm">
                  {c.blocked ? <><CheckCircle2 /> Réactiver le compte</> : <><Ban /> Suspendre le compte</>}
                </Button>
              </form>
              <form action={deleteCustomer}>
                <input type="hidden" name="id" value={c.id} />
                <ConfirmButton
                  message={`Supprimer le compte de « ${c.name} » ? Ses commandes sont conservées. Cette action est irréversible.`}
                  className={cn(buttonVariants({ variant: "destructive", size: "sm" }))}
                >
                  <Trash2 /> Supprimer le compte
                </ConfirmButton>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
