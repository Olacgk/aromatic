import { redirect } from "next/navigation";
import { api, ApiError } from "./api/client";
import { accessToken, clearTokens, setTokens } from "./session";

/** Back-office login: a normal API account with `is_staff`. Create one with `python manage.py createsuperuser`. */
export async function adminLogin(email: string, password: string): Promise<"ok" | "denied" | "credentials"> {
  try {
    const r = await api<{ access: string; refresh: string; user: { is_staff: boolean } }>("/auth/login/", {
      method: "POST",
      body: { email: email.trim().toLowerCase(), password },
    });
    if (!r.user.is_staff) return "denied"; // a valid customer account is not an admin
    await setTokens("admin", r);
    return "ok";
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 400)) return "credentials";
    throw e;
  }
}

export async function clearSession() {
  await clearTokens("admin");
}

/** Redirects to the login page unless a staff session exists. The API re-checks the role on every call anyway. */
export async function requireAdmin() {
  const token = await accessToken("admin");
  if (!token) redirect("/admin/login");
  try {
    const me = await api<{ is_staff: boolean }>("/auth/me/", { token });
    if (!me.is_staff) redirect("/admin/login");
  } catch (e) {
    if (e instanceof ApiError) redirect("/admin/login");
    throw e;
  }
}
