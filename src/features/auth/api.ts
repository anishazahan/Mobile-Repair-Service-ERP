import { db } from "@/mocks/db";
import { MockApiError, simulateRequest } from "@/mocks/server";
import type { Role, StaffUser } from "@/types";

export interface AuthSession {
  user: StaffUser;
  token: string;
}

export const DEMO_PASSWORD = "gadgetfix123";

const CREDENTIAL_EMAILS = new Set(db.staff.map((u) => u.email.toLowerCase()));

export async function login(
  email: string,
  password: string,
): Promise<AuthSession> {
  return simulateRequest(() => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = db.staff.find(
      (u) => u.email.toLowerCase() === normalizedEmail,
    );

    if (
      !user ||
      !CREDENTIAL_EMAILS.has(normalizedEmail) ||
      password !== DEMO_PASSWORD
    ) {
      throw new MockApiError("Invalid email or password.");
    }
    if (user.status !== "active") {
      throw new MockApiError(
        "This account is inactive. Contact your administrator.",
      );
    }
    return { user, token: `mock-token-${user.id}-${Date.now()}` };
  });
}

/** Which top-level ERP nav sections a role is allowed to see. */
export function canAccess(
  role: Role,
  section: "billing" | "reports" | "staff" | "settings",
): boolean {
  if (role === "admin" || role === "manager") return true;
  if (role === "front_desk") return section === "billing";
  return false; // technician
}
