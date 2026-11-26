type Field = { key: string; label: string; textarea?: boolean; rows?: number };
type Tr = Partial<Record<"fr" | "ar", Partial<Record<string, string>>>> | undefined;

const LANGS = [
  { code: "fr", label: "Français", dir: "ltr" },
  { code: "ar", label: "العربية (Arabe)", dir: "rtl" },
] as const;

/** Inputs named `<key>_fr` / `<key>_ar`, read by `trOf` in the admin actions. */
export default function TrFields({ fields, tr }: { fields: Field[]; tr?: Tr }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {LANGS.map((l) => (
        <div key={l.code} className="grid content-start gap-3 rounded-lg border p-3">
          <p className="text-xs font-semibold text-muted-foreground">{l.label}</p>
          {fields.map((f) => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              {f.textarea ? (
                <textarea
                  name={`${f.key}_${l.code}`}
                  rows={f.rows ?? 3}
                  dir={l.dir}
                  defaultValue={tr?.[l.code]?.[f.key] ?? ""}
                  className="input"
                />
              ) : (
                <input
                  name={`${f.key}_${l.code}`}
                  dir={l.dir}
                  defaultValue={tr?.[l.code]?.[f.key] ?? ""}
                  className="input"
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
