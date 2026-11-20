"use server";

import { cookies } from "next/headers";

import { isUserKey, SESSION_COOKIE } from "./session";

export async function switchUser(key: string) {
  if (!isUserKey(key)) return;
  (await cookies()).set(SESSION_COOKIE, key, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
