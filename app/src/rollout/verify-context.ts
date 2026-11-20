// Verifies the signed context Rollout adds to the app URL, exactly as
// "Verify the context" describes:
//   1. Signature: HMAC-SHA256 of the raw `context` parameter with the client
//      secret, as hex, compared in constant time to `signature`.
//   2. Decode: base64url, then JSON.
//   3. Expiry: refuse once x.exp has passed. Contexts last five minutes.
//   4. Replay: refuse an x.jti already accepted.
// Server-side only: the check needs the client secret.
import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { rememberJti } from "./replay-store";

/** The decoded context. Fields not marked "Always" in the docs are optional. */
export type EmbeddedAppContext = {
  context: "person";
  account?: { domain: string; owner: { name: string; email: string } };
  user: { id: string; name?: string; email?: string };
  person?: { id?: string; firstName?: string; lastName?: string; stage?: { id: string; name: string } };
  crm: { personId: string; accountId?: string };
  org?: { id: string };
  x: {
    platform: string;
    marketplaceId: string;
    appId: string;
    iat: number;
    exp: number;
    jti: string;
    preview?: boolean;
  };
};

export function verifyContext(
  context: string | null | undefined,
  signature: string | null | undefined,
  secret: string,
): EmbeddedAppContext | null {
  if (!context || !signature) return null;

  // 1. Signature
  const expected = createHmac("sha256", secret).update(context).digest();
  const actual = Buffer.from(signature, "hex");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  // 2. Decode
  let decoded: EmbeddedAppContext;
  try {
    decoded = JSON.parse(Buffer.from(context, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  // 3. Expiry
  if (typeof decoded?.x?.exp !== "number" || decoded.x.exp < Math.floor(Date.now() / 1000)) return null;

  // 4. Replay: store jti until exp, and fail if it's already there
  if (typeof decoded.x.jti !== "string" || !rememberJti(decoded.x.jti, decoded.x.exp)) return null;

  return decoded;
}
