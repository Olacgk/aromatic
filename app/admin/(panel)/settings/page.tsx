import { readDB } from "@/lib/db";
import { saveSettings } from "../actions";
import { Button, FormSection, PageHeader } from "@/components/admin/ui";
import TrFields from "@/components/admin/TrFields";

function Field({ label, name, value }: { label: string; name: string; value: string }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input name={name} defaultValue={value} className="input" />
    </div>
  );
}

export default async function AdminSettings() {
  const { settings: s } = await readDB();
  return (
    <>
      <PageHeader title="Paramètres" description="Identité, bandeau promotionnel, contact et réseaux sociaux." />
      <form action={saveSettings} className="grid gap-4 xl:grid-cols-2">
        <FormSection title="Général">
          <Field label="Nom de la boutique" name="siteName" value={s.siteName} />
          <div>
            <label className="label">À propos</label>
            <textarea name="about" rows={5} defaultValue={s.about} className="input" />
          </div>
        </FormSection>

        <FormSection title="Bandeau promotionnel" description="Affiché tout en haut de la boutique.">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="promoEnabled" defaultChecked={s.promo.enabled} className="size-4 accent-[var(--gold)]" />
            Afficher le bandeau
          </label>
          <Field label="Texte" name="promoText" value={s.promo.text} />
          <Field label="Mise en avant" name="promoDiscount" value={s.promo.discount} />
          <Field label="Lien" name="promoLink" value={s.promo.link} />
        </FormSection>

        <FormSection title="Contact">
          <Field label="Email" name="email" value={s.contact.email} />
          <Field label="Téléphone" name="phone" value={s.contact.phone} />
          <Field label="Lien WhatsApp" name="whatsapp" value={s.contact.whatsapp} />
        </FormSection>

        <FormSection title="Newsletter & réseaux sociaux">
          <Field label="Titre newsletter" name="newsletterTitle" value={s.newsletter.title} />
          <Field label="Code promo" name="newsletterCode" value={s.newsletter.code} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Facebook" name="facebook" value={s.social.facebook} />
            <Field label="Instagram" name="instagram" value={s.social.instagram} />
            <Field label="YouTube" name="youtube" value={s.social.youtube} />
            <Field label="Twitter" name="twitter" value={s.social.twitter} />
          </div>
        </FormSection>

        <div className="xl:col-span-2">
          <FormSection title="Traductions" description="Textes de la boutique en français et en arabe (anglais = champs ci-dessus).">
            <TrFields
              tr={s.tr}
              fields={[
                { key: "about", label: "À propos", textarea: true, rows: 4 },
                { key: "promoText", label: "Texte du bandeau" },
                { key: "newsletterTitle", label: "Titre newsletter" },
              ]}
            />
          </FormSection>
        </div>

        <div className="xl:col-span-2"><Button>Enregistrer les paramètres</Button></div>
      </form>
    </>
  );
}
