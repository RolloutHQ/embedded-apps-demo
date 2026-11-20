// The short-lived, single-use token the Connect popup carries, as "Signing
// agents in" describes: issued by our server for the agent in a verified
// context, so the popup knows which (marketplace, agent) to link.
// Signed with a key derived from the client secret; single use is tracked in
// memory, like the replay store.
import "server-only";

import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

import { clientSecret } from "./config";

export type ConnectClaims = { marketplaceId: string; userId: string; name?: string; email?: string; exp: number; nonce: string };

const LIFETIME_SECONDS = 10 * 60;
const key = () => createHmac("sha256", clientSecret()).update("lintel-connect-token-v1").digest();
const mac = (payload: string) => createHmac("sha256", key()).update(payload).digest("base64url");

const globalStore = globalThis as unknown as { __lintelUsedConnect?: Map<string, number> };
const used = (globalStore.__lintelUsedConnect ??= new Map<string, number>());

export function issueConnectToken(claims: Omit<ConnectClaims, "exp" | "nonce">): string {
  const payload = Buffer.from(
    JSON.stringify({ ...claims, exp: Math.floor(Date.now() / 1000) + LIFETIME_SECONDS, nonce: randomUUID() }),
  ).toString("base64url");
  return `${payload}.${mac(payload)}`;
}

export function readConnectToken(token: string | undefined | null): ConnectClaims | null {
  const [payload, signature] = (token ?? "").split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(mac(payload));
  const actual = Buffer.from(signature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as ConnectClaims;
  if (claims.exp < Math.floor(Date.now() / 1000) || used.has(claims.nonce)) return null;
  return claims;
}

/** Marks the token spent. Returns false if it already was. */
export function spendConnectToken(claims: ConnectClaims): boolean {
  const now = Math.floor(Date.now() / 1000);
  for (const [nonce, exp] of used) if (exp < now) used.delete(nonce);
  if (used.has(claims.nonce)) return false;
  used.set(claims.nonce, claims.exp);
  return true;
}
