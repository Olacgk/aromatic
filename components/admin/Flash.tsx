/** Error banner for admin pages: server actions redirect back with `?error=<message>`. */
export default function Flash({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p role="alert" className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {error}
    </p>
  );
}
