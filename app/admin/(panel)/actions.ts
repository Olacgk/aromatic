"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ApiError, errorMessage } from "@/lib/api/client";
import { adminApi, adminUpload } from "@/lib/admin-data";
import { clearSession, requireAdmin } from "@/lib/auth";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const num = (fd: FormData, k: string) => Number(fd.get(k)) || 0;
const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Reads <key>_fr / <key>_ar fields into the API's `translations` object (empty values are skipped). */
function trOf(fd: FormData, keys: string[], rename: Record<string, string> = {}) {
  const out: Record<string, Record<string, string>> = {};
  for (const l of ["fr", "ar"]) {
    const o: Record<string, string> = {};
    for (const k of keys) {
      const v = str(fd, k + "_" + l);
      if (v) o[rename[k] ?? k] = v;
    }
    if (Object.keys(o).length) out[l] = o;
  }
  return out; // {} clears the translations
}

function refresh() {
  revalidatePath("/", "layout");
}

/** Runs an API write; on a validation/conflict error goes back to `page` with the message shown in a banner. */
async function run(page: string, fn: () => Promise<unknown>) {
  try {
    await fn();
  } catch (e) {
    if (e instanceof ApiError && e.status < 500) redirect(`${page}?error=${encodeURIComponent(errorMessage(e))}`);
    throw e;
  }
}

export async function logout() {
  await clearSession();
  redirect("/admin/login");
}

/* Products */
export async function saveProduct(fd: FormData) {
  await requireAdmin();
  const origSlug = str(fd, "origSlug");
  const name = str(fd, "name");
  const variants = str(fd, "variants")
    .split("\n")
    .map((l) => l.split(":"))
    .filter((p) => p.length === 2 && p[0].trim() && Number(p[1]))
    .map(([label, price]) => ({ label: label.trim(), price: Number(price) }));
  const slug = slugify(str(fd, "slug") || (origSlug ? "" : name));
  const body = {
    name,
    ...(slug ? { slug } : {}),
    category: str(fd, "categorySlug"),
    price: variants.length ? Math.min(...variants.map((v) => v.price)) : num(fd, "price"),
    compare_price: num(fd, "comparePrice") || null,
    variants,
    colors: str(fd, "colors").split(",").map((c) => c.trim()).filter(Boolean),
    description: str(fd, "description"),
    image_url: str(fd, "image"),
    image2_url: str(fd, "image2"),
    stock: num(fd, "stock"),
    featured: fd.get("featured") === "on",
    published: fd.get("published") === "on",
    translations: trOf(fd, ["name", "description"]),
  };
  const page = origSlug ? `/admin/products/${str(fd, "id")}` : "/admin/products/new";
  await run(page, async () => {
    const saved = origSlug
      ? await adminApi<{ slug: string }>(`/products/${origSlug}/`, { method: "PATCH", body })
      : await adminApi<{ slug: string }>("/products/", { method: "POST", body });
    // Uploaded files go in a second, multipart request (nested data cannot be sent as multipart).
    const files = new FormData();
    for (const k of ["image_file", "image2_file"]) {
      const f = fd.get(k);
      if (f instanceof File && f.size > 0) files.append(k, f);
    }
    if ([...files.keys()].length) await adminUpload(`/products/${saved.slug}/`, files);
  });
  refresh();
  redirect("/admin/products");
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin();
  await run("/admin/products", () => adminApi(`/products/${str(fd, "slug")}/`, { method: "DELETE" }));
  refresh();
}

/* Categories */
export async function saveCategory(fd: FormData) {
  await requireAdmin();
  const origSlug = str(fd, "origSlug");
  const name = str(fd, "name");
  const body = {
    name,
    slug: slugify(str(fd, "slug") || name),
    image_url: str(fd, "image"),
    description: str(fd, "description"),
    translations: trOf(fd, ["name", "description"]),
  };
  await run("/admin/categories", () =>
    origSlug
      ? adminApi(`/categories/${origSlug}/`, { method: "PATCH", body })
      : adminApi("/categories/", { method: "POST", body }),
  );
  refresh();
}

export async function deleteCategory(fd: FormData) {
  await requireAdmin();
  await run("/admin/categories", () => adminApi(`/categories/${str(fd, "slug")}/`, { method: "DELETE" }));
  refresh();
}

/* Orders */
export async function setOrderStatus(fd: FormData) {
  await requireAdmin();
  await run("/admin/orders", () =>
    adminApi(`/admin/orders/${str(fd, "id")}/`, { method: "PATCH", body: { status: str(fd, "status") } }),
  );
  revalidatePath("/admin", "layout");
}

/* Pages */
export async function savePage(fd: FormData) {
  await requireAdmin();
  await run("/admin/pages", () =>
    adminApi(`/pages/${str(fd, "slug")}/`, {
      method: "PATCH",
      body: { title: str(fd, "title"), content: str(fd, "content"), translations: trOf(fd, ["title", "content"]) },
    }),
  );
  refresh();
}

/* Settings */
export async function saveSettings(fd: FormData) {
  await requireAdmin();
  await run("/admin/settings", () =>
    adminApi("/settings/", {
      method: "PATCH",
      body: {
        site_name: str(fd, "siteName"),
        about: str(fd, "about"),
        promo_enabled: fd.get("promoEnabled") === "on",
        promo_text: str(fd, "promoText"),
        promo_discount: str(fd, "promoDiscount"),
        promo_link: str(fd, "promoLink"),
        contact_email: str(fd, "email"),
        contact_phone: str(fd, "phone"),
        contact_whatsapp: str(fd, "whatsapp"),
        newsletter_title: str(fd, "newsletterTitle"),
        newsletter_code: str(fd, "newsletterCode"),
        facebook: str(fd, "facebook"),
        instagram: str(fd, "instagram"),
        youtube: str(fd, "youtube"),
        twitter: str(fd, "twitter"),
        translations: trOf(fd, ["about", "promoText", "newsletterTitle"], {
          promoText: "promo_text", newsletterTitle: "newsletter_title",
        }),
      },
    }),
  );
  refresh();
}

/* Customers */
export async function setCustomerBlocked(fd: FormData) {
  await requireAdmin();
  const action = fd.get("blocked") === "1" ? "suspend" : "activate";
  await run("/admin/customers", () => adminApi(`/admin/customers/${str(fd, "id")}/${action}/`, { method: "POST" }));
  revalidatePath("/admin/customers");
}

export async function saveCustomer(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await run(`/admin/customers/${id}`, () =>
    adminApi(`/admin/customers/${id}/`, {
      method: "PATCH",
      body: { name: str(fd, "name"), phone: str(fd, "phone"), address: str(fd, "address") },
    }),
  );
  revalidatePath("/admin/customers");
}

/** Removes the account and its favorites; past orders are kept for the books, unlinked. */
export async function deleteCustomer(fd: FormData) {
  await requireAdmin();
  await run("/admin/customers", () => adminApi(`/admin/customers/${str(fd, "id")}/`, { method: "DELETE" }));
  redirect("/admin/customers");
}
