"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  FileText,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShoppingBag,
  Sparkles,
  Sun,
  X,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui";

type Item = { label: string; href: string; icon: LucideIcon; exact?: boolean };
type Section = { label: string; items: Item[] };

const SECTIONS: Section[] = [
  { label: "Principal", items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true }] },
  {
    label: "Catalogue",
    items: [
      { label: "Produits", href: "/admin/products", icon: Package },
      { label: "Catégories", href: "/admin/categories", icon: FolderTree },
    ],
  },
  { label: "Ventes", items: [{ label: "Commandes", href: "/admin/orders", icon: ShoppingBag }] },
  {
    label: "Contenu",
    items: [
      { label: "Pages", href: "/admin/pages", icon: FileText },
      { label: "Paramètres", href: "/admin/settings", icon: Settings },
    ],
  },
];

const LABELS: Record<string, string> = {
  admin: "Administration",
  products: "Produits",
  categories: "Catégories",
  orders: "Commandes",
  pages: "Pages",
  settings: "Paramètres",
  new: "Nouveau",
};

function Nav({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-1 pb-4">
      {SECTIONS.map((s) => (
        <div key={s.label} className="px-3 py-2">
          {!collapsed && (
            <>
              <p className="px-2.5 pb-1.5 text-[0.7rem] font-semibold tracking-wider text-muted-foreground/80 uppercase">
                {s.label}
              </p>
              <div className="mb-2 h-px bg-sidebar-border" />
            </>
          )}
          <ul className="flex flex-col gap-0.5">
            {s.items.map(({ label, href, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    title={collapsed ? label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      collapsed && "justify-center px-0",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {!collapsed && <span className="truncate">{label}</span>}
                    {active && !collapsed && (
                      <span aria-hidden className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-gold" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <Link href="/admin" className={cn("flex min-w-0 items-center gap-2.5", collapsed && "justify-center")}>
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-gold text-black">
        <Sparkles className="size-4" aria-hidden />
      </span>
      {!collapsed && (
        <span className="min-w-0">
          <span className="block truncate text-sm leading-tight font-semibold">Aromatic Admin</span>
          <span className="block truncate text-[0.7rem] leading-tight text-muted-foreground">Gestion de la boutique</span>
        </span>
      )}
    </Link>
  );
}

export default function AdminShell({
  children,
  logout,
}: {
  children: React.ReactNode;
  logout: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      setDark(localStorage.getItem("admin-theme") === "dark");
      setCollapsed(localStorage.getItem("admin-collapsed") === "1");
    } catch {}
  }, []);

  const toggleDark = () =>
    setDark((d) => {
      try { localStorage.setItem("admin-theme", d ? "light" : "dark"); } catch {}
      return !d;
    });
  const toggleCollapsed = () =>
    setCollapsed((c) => {
      try { localStorage.setItem("admin-collapsed", c ? "0" : "1"); } catch {}
      return !c;
    });

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    href: "/" + segments.slice(0, i + 1).join("/"),
    label: LABELS[seg] ?? decodeURIComponent(seg),
  }));

  return (
    <div dir="ltr" lang="fr" className={cn("admin flex h-dvh w-full overflow-hidden", dark && "dark")}>
      <aside
        className={cn(
          "hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-out md:flex",
          collapsed ? "w-16" : "w-64",
        )}
        aria-label="Navigation principale"
      >
        <div className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-3">
          <Brand collapsed={collapsed} />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Nav collapsed={collapsed} />
        </div>
        <div className="flex shrink-0 flex-col gap-1 border-t border-sidebar-border p-2">
          <Link
            href="/"
            target="_blank"
            title="Voir la boutique"
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            <ExternalLink className="size-4 shrink-0" />
            {!collapsed && "Voir la boutique"}
          </Link>
        </div>
      </aside>

      {mobile && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobile(false)} />
          <aside className={cn("admin relative flex h-full w-72 flex-col bg-sidebar shadow-xl", dark && "dark")}>
            <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-3">
              <Brand collapsed={false} />
              <Button variant="ghost" size="icon" onClick={() => setMobile(false)} aria-label="Fermer">
                <X className="size-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Nav collapsed={false} onNavigate={() => setMobile(false)} />
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col bg-muted/30">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-2 backdrop-blur-sm sm:px-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobile(true)} aria-label="Ouvrir la navigation">
            <Menu className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:inline-flex" onClick={toggleCollapsed} aria-label="Réduire la navigation">
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </Button>
          <div className="mx-1 hidden h-5 w-px bg-border md:block" />

          <nav aria-label="Fil d'Ariane" className="min-w-0 flex-1">
            <ol className="flex items-center gap-1.5 overflow-hidden text-sm text-muted-foreground">
              {crumbs.map((c, i) => {
                const last = i === crumbs.length - 1;
                return (
                  <li key={c.href} className="flex min-w-0 items-center gap-1.5">
                    {last ? (
                      <span className="truncate font-medium text-foreground">{c.label}</span>
                    ) : (
                      <>
                        <Link href={c.href} className="truncate hover:text-foreground">{c.label}</Link>
                        <ChevronRight className="size-3.5 shrink-0" />
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="flex shrink-0 items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="Changer de thème">
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <div className="mx-1 hidden h-5 w-px bg-border sm:block" />
            <div className="hidden items-center gap-2 pr-1 sm:flex">
              <span className="flex size-7 items-center justify-center rounded-full bg-gold text-xs font-semibold text-black">A</span>
              <span className="text-sm font-medium">Admin</span>
            </div>
            <form action={logout}>
              <Button variant="ghost" size="icon" aria-label="Se déconnecter" title="Se déconnecter">
                <LogOut className="size-4" />
              </Button>
            </form>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
