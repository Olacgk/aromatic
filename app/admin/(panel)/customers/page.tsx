import Link from "next/link";
import { Search } from "lucide-react";
import { readAdminDB } from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";
import { Badge, Card, DataTable, PageHeader, THead, Td, Th } from "@/components/admin/ui";

export default async function AdminCustomers({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const { customers, orders } = await readAdminDB(["customers", "orders"]);
  const needle = q.trim().toLowerCase();
  const list = customers.filter(
    (c) => !needle || c.name.toLowerCase().includes(needle) || c.email.includes(needle) || (c.phone ?? "").includes(needle),
  );

  return (
    <>
      <PageHeader title="Clients" description={`${customers.length} compte(s) client sur la boutique.`} />
      <form className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input name="q" defaultValue={q} placeholder="Rechercher un nom, email, téléphone…" className="input pl-9" />
      </form>
      <Card className="py-0">
        {list.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            {customers.length ? "Aucun résultat." : "Aucun client inscrit pour le moment."}
          </p>
        ) : (
          <DataTable>
            <THead>
              <Th>Client</Th><Th>Connexion</Th><Th>Commandes</Th><Th>Dépensé</Th><Th>Favoris</Th><Th>Inscrit le</Th><Th>Statut</Th>
            </THead>
            <tbody>
              {list.map((c) => {
                const mine = orders.filter((o) => o.customerId === c.id);
                const spent = mine.filter((o) => o.status !== "cancelled").reduce((n, o) => n + o.total, 0);
                return (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                    <Td>
                      <Link href={`/admin/customers/${c.id}`} className="font-medium hover:underline">{c.name}</Link>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </Td>
                    <Td>
                      <div className="flex gap-1">
                        {c.hasGoogle && <Badge variant="info">Google</Badge>}
                        {c.hasPassword && <Badge variant="secondary">Email</Badge>}
                      </div>
                    </Td>
                    <Td>{mine.length}</Td>
                    <Td>{formatPrice(spent)}</Td>
                    <Td>{c.favorites.length}</Td>
                    <Td className="text-muted-foreground">{new Date(c.createdAt).toLocaleDateString("fr-FR")}</Td>
                    <Td>{c.blocked ? <Badge variant="destructive">Suspendu</Badge> : <Badge variant="success">Actif</Badge>}</Td>
                  </tr>
                );
              })}
            </tbody>
          </DataTable>
        )}
      </Card>
    </>
  );
}
