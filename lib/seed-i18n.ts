import type { DB } from "./types";

type Pair = [fr: string, ar: string];

const PRODUCT_DESC: Record<string, Pair> = {
  "dif-af60": ["Diffuseur d'arômes compact couvrant jusqu'à 60 m³.", "جهاز تعطير صغير يغطي حتى 60 م³."],
  "dif-af90": ["Diffuseur silencieux couvrant jusqu'à 90 m³.", "جهاز تعطير هادئ يغطي حتى 90 م³."],
  "dif-af200": ["Diffuseur puissant couvrant jusqu'à 200 m³.", "جهاز تعطير قوي يغطي حتى 200 م³."],
  "dif-hotel-experience-bundle": ["Diffuseur et huiles pour recréer le parfum d'un hôtel de luxe.", "جهاز تعطير مع زيوت لتعيش أجواء الفنادق الفاخرة."],
  "dif-af300-wall-diffuser": ["Diffuseur mural pour les espaces moyens.", "جهاز تعطير جداري للمساحات المتوسطة."],
  "dif-af3000-pro": ["Diffuseur professionnel pour les grands espaces commerciaux.", "جهاز تعطير احترافي للمساحات التجارية الكبيرة."],
  "dif-af300-smart": ["Diffuseur Wi-Fi piloté depuis votre téléphone.", "جهاز تعطير بالواي فاي يُتحكم به من هاتفك."],
  "oil-bloom": ["Notes florales fraîches.", "نفحات زهرية منعشة."],
  "oil-amber": ["Ambre chaud et vanille.", "عنبر دافئ وفانيليا."],
  "oil-royal-oud": ["Oud profond et riche.", "عود عميق وغني."],
  "oil-active": ["Agrumes et menthe énergisants.", "حمضيات ونعناع منشّط."],
  "oil-harmony": ["Mélange équilibré boisé et musqué.", "مزيج متوازن من الخشب والمسك."],
  "oil-elegant": ["Élégance poudrée et douce.", "أناقة بودرية ناعمة."],
  "oil-attraction": ["Une signature magnétique et sensuelle.", "توقيع عطري جذاب وحسي."],
  "perf-ghost": ["Parfum boisé et mystérieux.", "عطر خشبي غامض."],
  "perf-noir": ["Sombre, intense et raffiné.", "داكن ومكثّف وراقٍ."],
  "perf-oud": ["L'oud arabe classique.", "العود العربي الكلاسيكي."],
  "perf-amber": ["Parfum chaleureux à l'ambre.", "عطر دافئ بالعنبر."],
  "perf-floral": ["Bouquet de fleurs blanches.", "باقة من الزهور البيضاء."],
  "perf-grey": ["Fumé et moderne.", "دخاني وعصري."],
  "perf-opal": ["Floral musqué lumineux.", "زهري مسكي مشرق."],
  "perf-elixir": ["Doré, opulent et chaleureux.", "ذهبي فاخر ودافئ."],
  "perf-patchouli": ["Patchouli terreux et sillage sucré.", "باتشولي ترابي بأثر حلو."],
  "perf-black": ["Profond, sombre et magnétique.", "عميق وداكن وجذاب."],
  "perf-aura": ["Léger, aérien et radieux.", "خفيف وهوائي ومشرق."],
  "body-musk": ["Huile corporelle sans alcool.", "زيت للجسم خالٍ من الكحول."],
  "body-rose": ["Huile corporelle douce à la rose.", "زيت جسم بالورد الناعم."],
};

const CATEGORIES: Record<string, { fr: [string, string]; ar: [string, string] }> = {
  c1: {
    fr: ["Diffuseurs d'arômes", "Appareils de diffusion modernes pour la maison, le bureau et l'hôtel."],
    ar: ["أجهزة التعطير", "أجهزة نشر عطري حديثة للمنزل والمكتب والفنادق."],
  },
  c2: {
    fr: ["Huiles parfumées pour diffuseurs", "Huiles parfumées concentrées pour tous les diffuseurs."],
    ar: ["زيوت عطرية للأجهزة", "زيوت عطرية مركّزة لجميع الأجهزة."],
  },
  c3: {
    fr: ["Parfums de luxe", "Parfums de luxe signature."],
    ar: ["عطور فاخرة", "عطور فاخرة بتوقيعنا."],
  },
  c4: {
    fr: ["Huiles parfumées pour le corps", "Huiles parfumées pour le corps, sans alcool."],
    ar: ["زيوت عطرية للجسم", "زيوت عطرية للجسم خالية من الكحول."],
  },
};

const PAGES: Record<string, { fr: [string, string]; ar: [string, string] }> = {
  "privacy-policy": {
    fr: ["Politique de confidentialité", "Nous respectons votre vie privée et n'utilisons vos données que pour traiter vos commandes."],
    ar: ["سياسة الخصوصية", "نحترم خصوصيتك ولا نستخدم بياناتك إلا لمعالجة طلباتك."],
  },
  "delivery-returns": {
    fr: ["Politique d'échange et de retour", "Les articles non ouverts peuvent être retournés dans les 7 jours suivant la livraison."],
    ar: ["سياسة الاستبدال والإرجاع", "يمكن إرجاع المنتجات غير المفتوحة خلال 7 أيام من التسليم."],
  },
  "terms-conditions": {
    fr: ["Conditions générales", "En utilisant ce site, vous acceptez nos conditions générales de vente."],
    ar: ["الشروط والأحكام", "باستخدامك هذا الموقع فإنك توافق على شروط البيع الخاصة بنا."],
  },
};

export const SETTINGS_TR: NonNullable<DB["settings"]["tr"]> = {
  fr: {
    about:
      "Aromatic est une marque saoudienne de référence, spécialisée dans les appareils de parfumage modernes, les huiles essentielles innovantes et les parfums de luxe. Fondée en 2017 à Riyad.",
    promoText: "Soldes d'été, remise de",
    newsletterTitle: "Obtenez 15 % de réduction sur votre première commande",
  },
  ar: {
    about:
      "أروماتيك علامة سعودية رائدة متخصصة في أجهزة التعطير الحديثة والزيوت العطرية المبتكرة والعطور الفاخرة. تأسست عام 2017 في الرياض.",
    promoText: "تخفيضات الصيف، خصم",
    newsletterTitle: "احصل على خصم 15% على طلبك الأول",
  },
};

export const productTr = (id: string) => {
  const d = PRODUCT_DESC[id];
  return d ? { fr: { description: d[0] }, ar: { description: d[1] } } : undefined;
};

export const categoryTr = (id: string) => {
  const c = CATEGORIES[id];
  return c
    ? { fr: { name: c.fr[0], description: c.fr[1] }, ar: { name: c.ar[0], description: c.ar[1] } }
    : undefined;
};

export const pageTr = (slug: string) => {
  const p = PAGES[slug];
  return p
    ? { fr: { title: p.fr[0], content: p.fr[1] }, ar: { title: p.ar[0], content: p.ar[1] } }
    : undefined;
};

/** Fills in missing translations (used for fresh seeds and for older db.json files). */
export function withTranslations(db: DB): DB {
  db.settings.tr ??= SETTINGS_TR;
  for (const p of db.products) p.tr ??= productTr(p.id);
  for (const c of db.categories) c.tr ??= categoryTr(c.id);
  for (const pg of db.pages) pg.tr ??= pageTr(pg.slug);
  return db;
}
