"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartLine = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  variant?: string;
  color?: string;
  price: number;
  qty: number;
};

type Ctx = {
  lines: CartLine[];
  count: number;
  total: number;
  add: (l: Omit<CartLine, "key" | "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (o: boolean) => void;
};

const CartCtx = createContext<Ctx | null>(null);
const STORAGE = "aromatic-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE, JSON.stringify(lines));
  }, [lines, ready]);

  const value: Ctx = {
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    total: lines.reduce((n, l) => n + l.qty * l.price, 0),
    add: (l, qty = 1) => {
      const key = [l.productId, l.variant, l.color].join("|");
      setLines((cur) =>
        cur.some((x) => x.key === key)
          ? cur.map((x) => (x.key === key ? { ...x, qty: x.qty + qty } : x))
          : [...cur, { ...l, key, qty }],
      );
    },
    setQty: (key, qty) =>
      setLines((cur) => cur.map((x) => (x.key === key ? { ...x, qty: Math.max(1, qty) } : x))),
    remove: (key) => setLines((cur) => cur.filter((x) => x.key !== key)),
    clear: () => setLines([]),
    open,
    setOpen,
  };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
};
