import { requireAdmin } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import { logout } from "./actions";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <AdminShell logout={logout}>{children}</AdminShell>;
}
