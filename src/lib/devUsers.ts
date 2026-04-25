// Set NEXT_PUBLIC_DEV_BYPASS=true in .env.local to enable hardcoded test accounts
export const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === "true";

// Hardcoded test accounts — only active when DEV_BYPASS is true
export const DEV_USERS = [
  { email: "travaller@gmail.com", password: "travaller12345678", role: "traveler" as const },
  { email: "partner@gmail.com",   password: "partner12345678",   role: "partner"  as const },
] as const;

export const DEV_ADMIN = {
  email: "admin@gmail.com",
  password: "admin12345678",
};

export function findDevUser(email: string, password: string) {
  return DEV_USERS.find((u) => u.email === email && u.password === password) ?? null;
}
