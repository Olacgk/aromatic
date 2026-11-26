import { createHash } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "admin_session";
const password = () => process.env.ADMIN_PASSWORD ?? "admin123";
const token = () => createHash("sha256").update(`aromatic:${password()}`).digest("hex");

export const checkPassword = (input: string) => input === password();

export async function setSession() {
  (await cookies()).set(COOKIE, token(), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

export async function requireAdmin() {
  const c = (await cookies()).get(COOKIE)?.value;
  if (c !== token()) redirect("/admin/login");
}
