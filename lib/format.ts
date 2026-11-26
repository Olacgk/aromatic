export const formatPrice = (n: number) => `CFA${n.toLocaleString("en-US")}`;

export const productFrom = (p: { price: number; variants: { price: number }[] }) =>
  p.variants.length ? Math.min(...p.variants.map((v) => v.price)) : p.price;
