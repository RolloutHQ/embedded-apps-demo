// The two token endpoints the components call. Mounted by one-line route files:
//   GET /api/rollout/apps-token?personId=…   → embed:render, for one contact
//   GET /api/rollout/marketplace-token       → embed:enable (+ embed:enable_org for admins)
import "server-only";

import { findContactForUser } from "@/lib/data";
import { getSignedInUser } from "@/lib/session";

import { isConfigured } from "./config";
import { mintUserToken } from "./user-token";

const tokenResponse = (token: string) =>
  new Response(token, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });

const notConfigured = () =>
  new Response("Rollout isn't configured: set the ROLLOUT_* variables.", {
    status: 503,
  });

/** For mountEmbeddedApps(): a token for the signed-in user and one contact. */
export async function appsToken(request: Request): Promise<Response> {
  if (!isConfigured()) return notConfigured();

  const user = await getSignedInUser();
  const personId = new URL(request.url).searchParams.get("personId") ?? "";

  // The contact id comes from the browser: check this user may see it
  // before signing anything for it.
  const contact = findContactForUser(user, personId);
  if (!contact) return new Response("No such contact", { status: 404 });

  return tokenResponse(await mintUserToken(user, ["embed:render"], contact));
}

/** For mountEmbeddedAppMarketplace(): no contact, and the org scope for admins only. */
export async function marketplaceToken(): Promise<Response> {
  if (!isConfigured()) return notConfigured();

  const user = await getSignedInUser();
  const scopes =
    user.role === "admin"
      ? (["embed:enable", "embed:enable_org"] as const)
      : (["embed:enable"] as const);

  return tokenResponse(await mintUserToken(user, [...scopes]));
}
