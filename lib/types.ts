export type Lang = "fr" | "ar";
export type Tr<T> = Partial<Record<Lang, Partial<T>>>;

export type Variant = { label: string; price: number };

export type Product = {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  price: number;
  comparePrice?: number;
  variants: Variant[];
  colors: string[];
  description: string;
  image: string;
  image2?: string;
  stock: number;
  featured: boolean;
  published: boolean;
  tr?: Tr<{ name: string; description: string }>;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  image: string;
  description: string;
  tr?: Tr<{ name: string; description: string }>;
};

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
  productId: string;
  name: string;
  variant?: string;
  color?: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  customerId?: string;
  createdAt: string;
  customer: { name: string; email: string; phone: string; address: string };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  hasPassword: boolean;
  hasGoogle: boolean;
  avatar?: string;
  favorites: string[];
  blocked: boolean;
  createdAt: string;
  lastLoginAt?: string;
  /** Only filled by the admin API. */
  ordersCount?: number;
  totalSpent?: number;
};

export type PaymentMethod = { code: "wave" | "orange_money" | "card" | "mock"; label: string };

export type PaymentStatus = "pending" | "succeeded" | "failed" | "cancelled" | "expired";

export type Payment = {
  id: string;
  order: string;
  orderStatus: OrderStatus;
  provider: PaymentMethod["code"];
  amount: number;
  status: PaymentStatus;
  checkoutUrl: string;
  createdAt: string;
};

export type PageDoc = { slug: string; title: string; content: string; tr?: Tr<{ title: string; content: string }> };

export type Settings = {
  siteName: string;
  promo: { enabled: boolean; text: string; discount: string; link: string };
  about: string;
  contact: { email: string; phone: string; whatsapp: string };
  newsletter: { title: string; code: string };
  tr?: Tr<{ about: string; promoText: string; newsletterTitle: string }>;
  social: { facebook: string; instagram: string; youtube: string; twitter: string };
};

export type DB = {
  settings: Settings;
  categories: Category[];
  products: Product[];
  orders: Order[];
  customers: Customer[];
  pages: PageDoc[];
};
