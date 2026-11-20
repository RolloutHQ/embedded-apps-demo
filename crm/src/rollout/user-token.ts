// Signs the short-lived user token Rollout's components act with, exactly as
// "Mint user tokens" describes: HS256 with your client secret, iss = your
// tenant id, sub = your id for the user, and the scopes and embed claims under
// "rollout.com".
import "server-only";

import { SignJWT } from "jose";

import type { Contact } from "@/lib/data";
import type { CrmUser } from "@/lib/session";

import { clientSecret, tenantId } from "./config";

export type EmbedScope = "embed:render" | "embed:enable" | "embed:enable_org";

/** Rollout accepts at most an hour. The components fetch a fresh one when needed. */
const LIFETIME = "10m";

export async function mintUserToken(
  user: CrmUser,
  scopes: EmbedScope[],
  person?: Contact,
): Promise<string> {
  // Every id and value is a string; leave out keys you have no value for.
  const embed = {
    // Send the org in every token, the render token included: an app an
    // admin turned on for the org shows only to tokens naming that org.
    org: user.office.id,
    user: { name: user.name, email: user.email },
    account: {
      domain: user.office.domain,
      owner: { name: user.office.broker.name, email: user.office.broker.email },
    },
    ...(person && {
      person: {
        id: person.id,
        firstName: person.firstName,
        lastName: person.lastName,
        stage: { id: person.stage.id, name: person.stage.name },
      },
    }),
  };

  return new SignJWT({ "rollout.com": { scopes, embed } })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(tenantId())
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(LIFETIME)
    .sign(new TextEncoder().encode(clientSecret()));
}
