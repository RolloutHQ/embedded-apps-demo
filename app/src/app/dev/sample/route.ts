// Demo helper, not part of a real app: in development only, signs a sample
// context with ROLLOUT_CLIENT_SECRET (as scripts/sign-sample.mjs does) and
// redirects to /embed. Answers 404 in production, where anyone could use it.
import { createHmac, randomUUID } from "node:crypto";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const secret = process.env.ROLLOUT_CLIENT_SECRET;
  if (process.env.NODE_ENV === "production" || !secret) return new Response("Not found", { status: 404 });

  const url = new URL(request.url);
  const preview = url.searchParams.has("preview");
  const iat = Math.floor(Date.now() / 1000);
  const x = { platform: "sample", marketplaceId: "mkt_sample", appId: "app_sample", iat, exp: iat + 300, jti: `ctx_${randomUUID()}` };

  const context = preview
    ? {
        context: "person",
        user: { id: "rollout-preview-user", name: "Sample Agent" },
        person: { firstName: "Sample", lastName: "Contact" },
        crm: { accountId: "rollout-preview-account", personId: "rollout-preview-person" },
        org: { id: "rollout-preview-account" },
        x: { ...x, preview: true },
      }
    : {
        context: "person",
        account: { domain: "harbor-pine", owner: { name: "Marcus Bell", email: "marcus@harborpine.example" } },
        user: { id: "usr_dana_okafor", name: "Dana Okafor", email: "dana@harborpine.example" },
        person: { firstName: url.searchParams.get("name") ?? "Melissa", lastName: "Hartman", stage: { id: "3", name: "Active buyer" } },
        crm: { accountId: "office_harbor_pine", personId: url.searchParams.get("person") ?? "c_melissa_hartman" },
        org: { id: "office_harbor_pine" },
        x,
      };

  const encoded = Buffer.from(JSON.stringify(context)).toString("base64url");
  const signature = createHmac("sha256", secret).update(encoded).digest("hex");
  return Response.redirect(new URL(`/embed?context=${encoded}&signature=${signature}`, url), 302);
}
