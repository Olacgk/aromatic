"use client";
import { createContext, useCallback, useContext, useMemo, useState, useTransition, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toggleFavorite } from "@/app/(shop)/account/actions";

type Ctx = {
  name: string | null;
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
};
const AccountCtx = createContext<Ctx | null>(null);

export function AccountProvider({
  name, favorites: initial, children,
}: { name: string | null; favorites: string[]; children: ReactNode }) {
  const [favorites, setFavorites] = useState(initial);
  const [, start] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const toggle = useCallback(
    (id: string) => {
      if (name === null) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }
      setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [id, ...f])); // optimistic
      start(async () => {
        const res = await toggleFavorite(id);
        if (res.auth) setFavorites(res.favorites);
        else router.push(`/login?next=${encodeURIComponent(pathname)}`);
      });
    },
    [name, pathname, router],
  );

  const value = useMemo(
    () => ({ name, favorites, isFavorite: (id: string) => favorites.includes(id), toggle }),
    [name, favorites, toggle],
  );
  return <AccountCtx.Provider value={value}>{children}</AccountCtx.Provider>;
}

export function useAccount() {
  const c = useContext(AccountCtx);
  if (!c) throw new Error("useAccount outside AccountProvider");
  return c;
}
