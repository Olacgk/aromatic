"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { api, ApiError } from "@/lib/api/client";
import { clearTokens, setTokens } from "@/lib/session";
import { getCustomer, safeNext, shopApi } from "@/lib/customer-auth";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const back = (page: string, error: string, next: string) =>
  redirect(`${page}?error=${error}${next ? `&next=${encodeURIComponent(next)}` : ""}`);

type AuthResult = { access: string; refresh: string };

async function startSession(tokens: AuthResult) {
  await setTokens("shop", tokens);
  revalidatePath("/", "layout");
}

export async function register(fd: FormData) {
  const name = str(fd, "name");
  const email = str(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  const next = str(fd, "next");
  if (!name || !/^\S+@\S+\.\S+$/.test(email)) back("/register", "invalid", next);
  if (password.length < 8) back("/register", "short", next);

  let tokens: AuthResult;
  try {
    tokens = await api<AuthResult>("/auth/register/", { method: "POST", body: { name, email, password } });
  } catch (e) {
    if (e instanceof ApiError && e.status === 400) {
      const d = (e.data ?? {}) as Record<string, unknown>;
      back("/register", d.email ? "exists" : d.password ? "short" : "invalid", next);
    }
    throw e;
  }
  await startSession(tokens);
  redirect(safeNext(next));
}

export async function login(fd: FormData) {
  const next = str(fd, "next");
  let tokens: AuthResult;
  try {
    tokens = await api<AuthResult>("/auth/login/", {
      method: "POST",
      body: { email: str(fd, "email").toLowerCase(), password: String(fd.get("password") ?? "") },
    });
  } catch (e) {
    // wrong credentials and suspended accounts both answer 401
    if (e instanceof ApiError && (e.status === 401 || e.status === 400)) back("/login", "credentials", next);
    throw e;
  }
  await startSession(tokens);
  redirect(safeNext(next));
}

/** Called by the Google button with the ID token Google Identity Services returned. */
export async function googleLogin(credential: string, next: string): Promise<{ error: "google" | "blocked" | "google_off" }> {
  let tokens: AuthResult;
  try {
    tokens = await api<AuthResult>("/auth/google/", { method: "POST", body: { credential } });
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.status === 403) return { error: "blocked" };
      if (JSON.stringify(e.data).includes("not configured")) return { error: "google_off" };
    }
    return { error: "google" };
  }
  await startSession(tokens);
  redirect(safeNext(next));
}

export async function logout() {
  await clearTokens("shop");
  revalidatePath("/", "layout");
  redirect("/");
}

export async function updateProfile(fd: FormData) {
  if (!(await getCustomer())) redirect("/login");
  const password = String(fd.get("password") ?? "");
  if (password && password.length < 8) redirect("/account?error=short");

  await shopApi("/auth/me/", {
    method: "PATCH",
    body: { name: str(fd, "name"), phone: str(fd, "phone"), address: str(fd, "address") },
  });
  if (password) {
    try {
      await shopApi("/auth/password/", {
        method: "POST",
        body: { current_password: String(fd.get("current_password") ?? ""), new_password: password },
      });
    } catch (e) {
      if (e instanceof ApiError) redirect("/account?error=password");
      throw e;
    }
  }
  revalidatePath("/account");
  redirect("/account?saved=1");
}

/** Returns auth:false when nobody is signed in so the client can send the visitor to /login. */
export async function toggleFavorite(productId: string): Promise<{ auth: boolean; favorites: string[] }> {
  const res = await shopApi<{ favorites: number[] }>("/favorites/toggle/", { method: "POST", body: { product: Number(productId) } });
  if (!res) return { auth: false, favorites: [] };
  revalidatePath("/account/favorites");
  return { auth: true, favorites: res.favorites.map(String) };
}
