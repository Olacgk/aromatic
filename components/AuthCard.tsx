import Link from "next/link";
import type { Key } from "@/lib/i18n/dictionaries";
import { getI18n } from "@/lib/i18n/server";
import { login, register } from "@/app/(shop)/account/actions";
import { safeNext } from "@/lib/customer-auth";
import GoogleButton from "./GoogleButton";

export default async function AuthCard({
  mode, error, next,
}: { mode: "login" | "register"; error?: string; next?: string }) {
  const { t } = await getI18n();
  const isLogin = mode === "login";
  const nextQ = next ? `?next=${encodeURIComponent(safeNext(next))}` : "";
  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <h1 className="font-display text-5xl">{t(isLogin ? "auth.loginTitle" : "auth.registerTitle")}</h1>
      <p className="mb-8 mt-3 text-foreground/60">{t(isLogin ? "auth.loginText" : "auth.registerText")}</p>

      <GoogleButton next={safeNext(next)} />

      <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-widest text-foreground/40">
        <span className="h-px flex-1 bg-line" /> {t("auth.or")} <span className="h-px flex-1 bg-line" />
      </div>

      <form action={isLogin ? login : register} className="space-y-4">
        <input type="hidden" name="next" value={next ?? ""} />
        {!isLogin && (
          <div><label className="label">{t("auth.name")}</label><input name="name" required autoComplete="name" className="field" /></div>
        )}
        <div><label className="label">{t("auth.email")}</label><input name="email" type="email" required autoComplete="email" className="field" dir="ltr" /></div>
        <div>
          <label className="label">{t("auth.password")}</label>
          <input
            name="password" type="password" required minLength={isLogin ? undefined : 8}
            autoComplete={isLogin ? "current-password" : "new-password"} className="field" dir="ltr"
          />
          {!isLogin && <p className="mt-1 text-xs text-foreground/40">{t("auth.passwordHint")}</p>}
        </div>
        {error && (
          <p role="alert" className="text-sm text-red-400">
            {t(errorKey(error))}
          </p>
        )}
        <button className="btn w-full">{t(isLogin ? "auth.login" : "auth.register")}</button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/60">
        {t(isLogin ? "auth.noAccount" : "auth.haveAccount")}{" "}
        <Link href={`${isLogin ? "/register" : "/login"}${nextQ}`} className="link-u text-gold">
          {t(isLogin ? "auth.register" : "auth.login")}
        </Link>
      </p>
    </div>
  );
}

const ERRORS = ["credentials", "exists", "invalid", "short", "blocked", "google", "google_off"];
const errorKey = (e: string): Key => (ERRORS.includes(e) ? (`auth.err.${e}` as Key) : "auth.err.google");
