import type { DB, Product } from "./types";
import manifest from "../public/img/manifest.json";
import { withTranslations } from "./seed-i18n";

const files = manifest as Record<string, string>;
const img = (id: string, n: number) => files[`${id}-${n}`] ?? "";

const base = (id: string): Pick<Product, "id" | "image" | "image2"> => ({
  id,
  image: img(id, 1),
  image2: img(id, 2) || undefined,
});

const oil = (slug: string, name: string, desc: string): Product => ({
  ...base(`oil-${slug}`),
  slug: `${slug}-diffuser-oil`, name, categorySlug: "aromatic-oils", price: 5000,
  variants: [
    { label: "10GM", price: 5000 }, { label: "100GM", price: 38000 },
    { label: "500GM", price: 120000 }, { label: "1000GM", price: 220000 },
  ],
  colors: [], description: desc, stock: 100, featured: true, published: true,
});

const perfume = (slug: string, name: string, price: number, desc: string): Product => ({
  ...base(`perf-${slug}`),
  slug: `${slug}-perfume`, name, categorySlug: "luxury-perfumes", price,
  variants: [], colors: [], description: desc, stock: 40, featured: true, published: true,
});

const diffuser = (
  slug: string, name: string, price: number, colors: string[], desc: string, comparePrice?: number,
): Product => ({
  ...base(`dif-${slug}`),
  slug, name, categorySlug: "aroma-diffuser", price, comparePrice,
  variants: [], colors, description: desc, stock: 25, featured: true, published: true,
});

const rawSeed: DB = {
  settings: {
    siteName: "Aromatic Africa",
    promo: { enabled: true, text: "Summer sale discount off", discount: "50%", link: "/collections/sale" },
    about:
      "Aromatic is a leading Saudi brand specializing in modern fragrance devices, innovative essential oils, and luxury perfume products. Founded in 2017 in Riyadh.",
    contact: { email: "care@aromatic.africa", phone: "+221779066413", whatsapp: "https://wa.me/221779066413" },
    newsletter: { title: "Get 15% off for your first order", code: "CODE15OFF" },
    social: { facebook: "#", instagram: "#", youtube: "#", twitter: "#" },
  },
  categories: [
    { id: "c1", slug: "aroma-diffuser", name: "Aroma Diffusers", image: files["cat-aroma-diffuser"] ?? "", description: "Modern scent diffusion devices for home, office and hotels." },
    { id: "c2", slug: "aromatic-oils", name: "Diffuser Fragrance Oils", image: files["cat-aromatic-oils"] ?? "", description: "Concentrated fragrance oils for every diffuser." },
    { id: "c3", slug: "luxury-perfumes", name: "Luxury Perfumes", image: files["cat-luxury-perfumes"] ?? "", description: "Signature luxury perfumes." },
    { id: "c4", slug: "body-fragrance-oils", name: "Body Fragrance Oils", image: files["cat-body-fragrance-oils"] ?? "", description: "Alcohol-free body fragrance oils." },
  ],
  products: [
    diffuser("af60", "AF60", 45000, ["Black", "White", "Pink"], "Compact aroma diffuser covering up to 60 m³."),
    diffuser("af90", "AF90", 43500, ["Black", "White"], "Quiet diffuser covering up to 90 m³.", 50000),
    diffuser("af200", "AF200", 55000, ["Black", "White"], "Powerful diffuser covering up to 200 m³."),
    diffuser("hotel-experience-bundle", "Hotel Experience Bundle", 55000, [], "Diffuser plus oils to recreate a luxury hotel scent."),
    diffuser("af300-wall-diffuser", "AF300 Wall Diffuser", 67500, [], "Wall-mounted diffuser for medium spaces.", 75000),
    diffuser("af3000-pro", "AF3000 Pro", 249000, [], "Professional diffuser for large commercial spaces.", 350000),
    diffuser("af300-smart", "AF300 Smart", 67500, [], "Wi-Fi diffuser controlled from your phone.", 75000),
    oil("bloom", "Bloom", "Fresh floral notes."),
    oil("amber", "Amber", "Warm amber and vanilla."),
    oil("royal-oud", "Royal Oud", "Deep, rich oud."),
    oil("active", "Active", "Energizing citrus and mint."),
    oil("harmony", "Harmony", "Balanced woody-musk blend."),
    oil("elegant", "Elegant", "Soft powdery elegance."),
    oil("attraction", "Attraction", "A magnetic, sensual signature."),
    perfume("ghost", "Ghost", 67500, "Mysterious woody fragrance."),
    perfume("noir", "Noir", 63500, "Dark, intense and refined."),
    perfume("oud", "Oud", 67500, "Classic Arabian oud."),
    perfume("amber", "Amber", 67500, "Warm amber perfume."),
    perfume("floral", "Floral", 63500, "Bouquet of white flowers."),
    perfume("grey", "Grey", 67500, "Smoky and modern."),
    perfume("opal", "OPAL", 67500, "Luminous musky floral."),
    perfume("elixir", "Elixir", 67500, "Golden, opulent and warm."),
    perfume("patchouli", "Patchouli", 63500, "Earthy patchouli with a sweet trail."),
    perfume("black", "Black", 67500, "Deep, dark and magnetic."),
    perfume("aura", "Aura", 63500, "Light, airy and radiant."),
    {
      ...perfume("musk", "White Musk Body Oil", 12000, "Alcohol-free body oil."),
      id: "body-musk", slug: "white-musk-body-oil", categorySlug: "body-fragrance-oils",
      image: files["cat-body-fragrance-oils"] ?? "", image2: undefined,
    },
    {
      ...perfume("rose", "Rose Body Oil", 12000, "Soft rose body oil."),
      id: "body-rose", slug: "rose-body-oil", categorySlug: "body-fragrance-oils",
      image: files["cat-body-fragrance-oils"] ?? "", image2: undefined,
    },
  ],
  orders: [
    {
      id: "ORD-1001", createdAt: "2026-11-20T10:00:00.000Z",
      customer: { name: "Awa Diop", email: "awa@example.com", phone: "+221770000000", address: "Dakar, Plateau" },
      items: [{ productId: "dif-af60", name: "AF60", color: "Black", price: 45000, qty: 1 }],
      total: 45000, status: "paid",
    },
  ],
  pages: [
    { slug: "privacy-policy", title: "Privacy Policy", content: "We respect your privacy and only use your data to process orders." },
    { slug: "delivery-returns", title: "Exchange & Return Policy", content: "Unopened items can be returned within 7 days of delivery." },
    { slug: "terms-conditions", title: "Terms and Conditions", content: "By using this site you agree to our terms of sale." },
  ],
};

export const seed: DB = withTranslations(rawSeed);
