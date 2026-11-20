// A fake sign-in for the demo: two users in one office, switched with a cookie.
// A real CRM uses its own session here; the Rollout code only needs the user's
// stable id, name, email, org, and whether they're an org admin.
import "server-only";

import { cookies } from "next/headers";

export type Office = {
  id: string;
  name: string;
  domain: string;
  broker: { name: string; email: string };
};

export type CrmUser = {
  id: string;
  name: string;
  initials: string;
  email: string;
  title: string;
  role: "agent" | "admin";
  office: Office;
};

export const OFFICE: Office = {
  id: "office_harbor_pine",
  name: "Harbor & Pine Realty",
  domain: "harbor-pine",
  broker: { name: "Marcus Bell", email: "marcus@harborpine.example" },
};

export const USERS = {
  dana: {
    id: "usr_dana_okafor",
    name: "Dana Okafor",
    initials: "DO",
    email: "dana@harborpine.example",
    title: "Buyer's agent",
    role: "agent",
    office: OFFICE,
  },
  marcus: {
    id: "usr_marcus_bell",
    name: "Marcus Bell",
    initials: "MB",
    email: "marcus@harborpine.example",
    title: "Managing broker, org admin",
    role: "admin",
    office: OFFICE,
  },
} as const satisfies Record<string, CrmUser>;

export type UserKey = keyof typeof USERS;

export const SESSION_COOKIE = "stoop_demo_user";

export const isUserKey = (value: unknown): value is UserKey =>
  typeof value === "string" && value in USERS;

export async function getSignedInKey(): Promise<UserKey> {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  return isUserKey(value) ? value : "dana";
}

export async function getSignedInUser(): Promise<CrmUser> {
  return USERS[await getSignedInKey()];
}
