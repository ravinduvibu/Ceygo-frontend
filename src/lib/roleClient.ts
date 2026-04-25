export async function setRoleCookie(role: string): Promise<void> {
  await fetch("/api/auth/set-role", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
}

export async function clearRoleCookie(): Promise<void> {
  await fetch("/api/auth/set-role", { method: "DELETE" });
}
