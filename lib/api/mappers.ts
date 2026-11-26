/** Converts the Django API's JSON (snake_case, numeric ids) into the shapes the UI components already use. */
import type { Category, Customer, Order, OrderItem, OrderStatus, PageDoc, Product, Settings, Tr } from "../types";

type Raw = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const str = (v: unknown) => (v == null ? "" : String(v));

export function toCategory(c: Raw): Category {
  return {
    id: str(c.id), slug: c.slug, name: c.name, image: c.image ?? "", description: c.description ?? "",
    tr: c.translations && Object.keys(c.translations).length ? c.translations : undefined,
  };
}

export function toProduct(p: Raw): Product {
  return {
    id: str(p.id),
    slug: p.slug,
    name: p.name,
    categorySlug: p.category,
    price: p.price,
    comparePrice: p.compare_price ?? undefined,
    variants: (p.variants ?? []).map((v: Raw) => ({ label: v.label, price: v.price })),
    colors: p.colors ?? [],
    description: p.description ?? "",
    image: p.image ?? "",
    image2: p.image2 || undefined,
    stock: p.stock,
    featured: p.featured,
    published: p.published,
    tr: p.translations && Object.keys(p.translations).length ? p.translations : undefined,
  };
}

export function toPage(p: Raw): PageDoc {
  return {
    slug: p.slug, title: p.title, content: p.content ?? "",
    tr: p.translations && Object.keys(p.translations).length ? p.translations : undefined,
  };
}

/** API settings use snake_case inside `translations`; the UI uses camelCase. */
export function toSettings(s: Raw): Settings {
  const tr: Tr<{ about: string; promoText: string; newsletterTitle: string }> = {};
  for (const [lang, f] of Object.entries((s.translations ?? {}) as Record<string, Raw>)) {
    (tr as Raw)[lang] = { about: f.about, promoText: f.promo_text, newsletterTitle: f.newsletter_title };
  }
  return {
    siteName: s.site_name,
    about: s.about ?? "",
    promo: s.promo,
    contact: s.contact,
    newsletter: s.newsletter,
    social: s.social,
    tr: Object.keys(tr).length ? tr : undefined,
  };
}

export function toOrder(o: Raw): Order {
  return {
    id: o.number,
    customerId: o.user != null ? str(o.user) : undefined,
    createdAt: o.created_at,
    customer: o.customer,
    items: (o.items ?? []).map(
      (i: Raw): OrderItem => ({
        productId: str(i.product), name: i.name, variant: i.variant || undefined, color: i.color || undefined,
        price: i.price, qty: i.qty,
      }),
    ),
    total: o.total,
    status: o.status as OrderStatus,
  };
}

export function toCustomer(c: Raw): Customer {
  return {
    id: str(c.id),
    name: c.name,
    email: c.email,
    phone: c.phone || undefined,
    address: c.address || undefined,
    hasPassword: Boolean(c.has_password),
    hasGoogle: Boolean(c.has_google),
    avatar: c.avatar_url || undefined,
    favorites: (c.favorite_ids ?? []).map(str),
    blocked: c.is_active === false,
    createdAt: c.date_joined,
    lastLoginAt: c.last_login ?? undefined,
    ordersCount: c.orders_count,
    totalSpent: c.total_spent != null ? Number(c.total_spent) : undefined,
  };
}
