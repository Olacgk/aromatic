"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateDB } from "@/lib/db";
import { clearSession, requireAdmin } from "@/lib/auth";
import type { OrderStatus, Product } from "@/lib/types";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const num = (fd: FormData, k: string) => Number(fd.get(k)) || 0;
const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Reads <key>_fr / <key>_ar fields into a translations object (empty values are skipped). */
function trOf<K extends string>(fd: FormData, keys: K[]) {
  const out: Partial<Record<"fr" | "ar", Partial<Record<K, string>>>> = {};
  for (const l of ["fr", "ar"] as const) {
    const o: Partial<Record<K, string>> = {};
    for (const k of keys) {
      const v = str(fd, k + "_" + l);
      if (v) o[k] = v;
    }
    if (Object.keys(o).length) out[l] = o;
  }
  return Object.keys(out).length ? out : undefined;
}

function refresh() {
  revalidatePath("/", "layout");
}

export async function logout() {
  await clearSession();
  redirect("/admin/login");
}

/* Products */
export async function saveProduct(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const name = str(fd, "name");
  const variants = str(fd, "variants")
    .split("\n")
    .map((l) => l.split(":"))
    .filter((p) => p.length === 2 && p[0].trim() && Number(p[1]))
    .map(([label, price]) => ({ label: label.trim(), price: Number(price) }));
  const price = variants.length ? Math.min(...variants.map((v) => v.price)) : num(fd, "price");
  const data: Omit<Product, "id"> = {
    slug: slugify(str(fd, "slug") || name),
    name,
    categorySlug: str(fd, "categorySlug"),
    price,
    comparePrice: num(fd, "comparePrice") || undefined,
    variants,
    colors: str(fd, "colors").split(",").map((c) => c.trim()).filter(Boolean),
    description: str(fd, "description"),
    image: str(fd, "image"),
    image2: str(fd, "image2") || undefined,
    stock: num(fd, "stock"),
    featured: fd.get("featured") === "on",
    published: fd.get("published") === "on",
    tr: trOf(fd, ["name", "description"]),
  };
  await updateDB((db) => {
    if (id) {
      const i = db.products.findIndex((p) => p.id === id);
      if (i >= 0) db.products[i] = { id, ...data };
    } else {
      db.products.push({ id: `p-${Date.now()}`, ...data });
    }
  });
  refresh();
  redirect("/admin/products");
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await updateDB((db) => {
    db.products = db.products.filter((p) => p.id !== id);
  });
  refresh();
}

/* Categories */
export async function saveCategory(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const name = str(fd, "name");
  const data = {
    name,
    slug: slugify(str(fd, "slug") || name),
    image: str(fd, "image"),
    description: str(fd, "description"),
    tr: trOf(fd, ["name", "description"]),
  };
  await updateDB((db) => {
    if (id) {
      const c = db.categories.find((x) => x.id === id);
      if (c) {
        const old = c.slug;
        Object.assign(c, data);
        if (old !== data.slug) db.products.forEach((p) => p.categorySlug === old && (p.categorySlug = data.slug));
      }
    } else {
      db.categories.push({ id: `c-${Date.now()}`, ...data });
    }
  });
  refresh();
}

export async function deleteCategory(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await updateDB((db) => {
    const c = db.categories.find((x) => x.id === id);
    if (c && !db.products.some((p) => p.categorySlug === c.slug)) {
      db.categories = db.categories.filter((x) => x.id !== id);
    }
  });
  refresh();
}

/* Orders */
export async function setOrderStatus(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const status = str(fd, "status") as OrderStatus;
  await updateDB((db) => {
    const o = db.orders.find((x) => x.id === id);
    if (o) o.status = status;
  });
  revalidatePath("/admin", "layout");
}

/* Pages */
export async function savePage(fd: FormData) {
  await requireAdmin();
  const slug = str(fd, "slug");
  await updateDB((db) => {
    const p = db.pages.find((x) => x.slug === slug);
    if (p) {
      p.title = str(fd, "title");
      p.content = str(fd, "content");
      p.tr = trOf(fd, ["title", "content"]);
    }
  });
  refresh();
}

/* Settings */
export async function saveSettings(fd: FormData) {
  await requireAdmin();
  await updateDB((db) => {
    db.settings = {
      siteName: str(fd, "siteName"),
      promo: {
        enabled: fd.get("promoEnabled") === "on",
        text: str(fd, "promoText"),
        discount: str(fd, "promoDiscount"),
        link: str(fd, "promoLink"),
      },
      about: str(fd, "about"),
      tr: trOf(fd, ["about", "promoText", "newsletterTitle"]),
      contact: { email: str(fd, "email"), phone: str(fd, "phone"), whatsapp: str(fd, "whatsapp") },
      newsletter: { title: str(fd, "newsletterTitle"), code: str(fd, "newsletterCode") },
      social: {
        facebook: str(fd, "facebook"),
        instagram: str(fd, "instagram"),
        youtube: str(fd, "youtube"),
        twitter: str(fd, "twitter"),
      },
    };
  });
  refresh();
}
