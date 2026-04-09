/**
 * Заглушка під майбутній backend (Supabase / Firebase / Node API).
 * Підключення: задати NEXT_PUBLIC_API_URL і реалізувати fetch-обгортки тут.
 */
export const apiBaseUrl =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? ""
    : "";

export async function healthCheck(): Promise<boolean> {
  if (!apiBaseUrl) return false;
  try {
    const r = await fetch(`${apiBaseUrl}/health`, { method: "GET" });
    return r.ok;
  } catch {
    return false;
  }
}
