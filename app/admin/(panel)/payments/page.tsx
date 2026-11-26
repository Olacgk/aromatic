import { AlertTriangle } from "lucide-react";
import { adminApi } from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";
import { Badge, Card, DataTable, PageHeader, THead, Td, Th } from "@/components/admin/ui";

type Row = {
  id: string; order: string; provider: string; amount: number; status: string; reference: string;
  failure_reason: string; created_at: string; paid_at: string | null; provider_data: { needs_review?: boolean };
};

const PROVIDERS: Record<string, string> = { wave: "Wave", orange_money: "Orange Money", card: "Carte (PayTech)", mock: "Simulation" };
const STATUS: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "secondary" }> = {
  pending: { label: "En attente", variant: "warning" },
  succeeded: { label: "Réussi", variant: "success" },
  failed: { label: "Échoué", variant: "destructive" },
  cancelled: { label: "Annulé", variant: "secondary" },
  expired: { label: "Expiré", variant: "secondary" },
};

export default async function AdminPayments({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = "" } = await searchParams;
  const data = await adminApi<{ count: number; results: Row[] }>("/admin/payments/", { query: { status, page_size: 100 } });
  const review = data.results.filter((p) => p.provider_data?.needs_review);

  return (
    <>
      <PageHeader title="Paiements" description={`${data.count} tentative(s) de paiement (Wave, Orange Money, carte).`} />
      {review.length > 0 && (
        <p className="mb-4 flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          {review.length} paiement(s) reçu(s) pour une commande annulée ({review.map((p) => p.order).join(", ")}) : remboursez le client ou réactivez la commande.
        </p>
      )}
      <form className="mb-4 flex gap-2">
        <select name="status" defaultValue={status} className="input max-w-48">
          <option value="">Tous les statuts</option>
          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <button className="rounded-md border px-3 text-sm hover:bg-muted">Filtrer</button>
      </form>
      <Card className="py-0">
        {data.results.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">Aucun paiement.</p>
        ) : (
          <DataTable className="min-w-[44rem]">
            <THead>
              <Th>Référence</Th><Th>Commande</Th><Th>Moyen</Th><Th>Montant</Th><Th>Statut</Th><Th>Date</Th>
            </THead>
            <tbody>
              {data.results.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                  <Td className="font-mono text-xs">{p.reference}</Td>
                  <Td className="font-mono text-xs">{p.order}</Td>
                  <Td>{PROVIDERS[p.provider] ?? p.provider}</Td>
                  <Td>{formatPrice(p.amount)}</Td>
                  <Td>
                    <Badge variant={STATUS[p.status]?.variant ?? "secondary"}>{STATUS[p.status]?.label ?? p.status}</Badge>
                    {p.failure_reason && <p className="mt-0.5 text-xs text-muted-foreground">{p.failure_reason}</p>}
                  </Td>
                  <Td className="text-muted-foreground">{new Date(p.created_at).toLocaleString("fr-FR")}</Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </Card>
    </>
  );
}
