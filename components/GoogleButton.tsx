"use client";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "./LocaleProvider";
import { googleLogin } from "@/app/(shop)/account/actions";
import type { Key } from "@/lib/i18n/dictionaries";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const SRC = "https://accounts.google.com/gsi/client";

type GIS = {
  accounts: {
    id: {
      initialize: (o: { client_id: string; callback: (r: { credential: string }) => void; ux_mode?: string }) => void;
      renderButton: (el: HTMLElement, o: Record<string, unknown>) => void;
    };
  };
};
declare global {
  interface Window {
    google?: GIS;
  }
}

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
    const s = existing ?? Object.assign(document.createElement("script"), { src: SRC, async: true, defer: true });
    s.addEventListener("load", () => resolve());
    s.addEventListener("error", () => reject(new Error("Google script failed to load")));
    if (!existing) document.head.appendChild(s);
  });
}

/** Official "Sign in with Google" button (Google Identity Services). The returned ID token is verified by the API. */
export default function GoogleButton({ next }: { next: string }) {
  const { t, locale } = useI18n();
  const box = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<"google" | "blocked" | "google_off" | null>(CLIENT_ID ? null : "google_off");

  useEffect(() => {
    if (!CLIENT_ID || !box.current) return;
    const el = box.current;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: async ({ credential }) => {
            const res = await googleLogin(credential, next); // redirects on success
            if (res?.error) setError(res.error);
          },
        });
        window.google.accounts.id.renderButton(el, {
          type: "standard", theme: "outline", size: "large", text: "continue_with", shape: "rectangular",
          width: Math.min(400, el.offsetWidth || 400), locale,
        });
      })
      .catch(() => setError("google"));
    return () => {
      cancelled = true;
    };
  }, [next, locale]);

  return (
    <div>
      {CLIENT_ID ? (
        <div ref={box} className="flex min-h-11 justify-center" />
      ) : (
        <button type="button" disabled className="w-full cursor-not-allowed border border-line py-3 text-sm text-foreground/40">
          {t("auth.google")}
        </button>
      )}
      {error && <p role="alert" className="mt-2 text-sm text-red-400">{t(`auth.err.${error}` as Key)}</p>}
    </div>
  );
}
