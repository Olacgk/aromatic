import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { checkPassword, setSession } from "@/lib/auth";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui";

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  async function login(fd: FormData) {
    "use server";
    if (!checkPassword(String(fd.get("password")))) redirect("/admin/login?error=1");
    await setSession();
    redirect("/admin");
  }
  return (
    <div dir="ltr" lang="fr" className="admin flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-sm py-6">
        <CardHeader className="flex-col items-center gap-3 text-center">
          <span className="flex size-10 items-center justify-center rounded-lg bg-gold text-black">
            <Sparkles className="size-5" />
          </span>
          <div className="space-y-1">
            <CardTitle className="text-xl">Aromatic Admin</CardTitle>
            <CardDescription>Connectez-vous pour gérer la boutique.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form action={login} className="grid gap-4">
            <div>
              <label className="label">Mot de passe</label>
              <input name="password" type="password" required autoFocus className="input" />
            </div>
            {error && <p className="text-sm text-destructive">Mot de passe incorrect.</p>}
            <Button size="default" className="w-full">Se connecter</Button>
            <p className="text-center text-xs text-muted-foreground">
              Par défaut : admin123 (variable ADMIN_PASSWORD dans .env.local)
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
