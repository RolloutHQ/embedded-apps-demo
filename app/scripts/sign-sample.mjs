#!/usr/bin/env node
// Signs a sample context the way Rollout signs a launch, for testing /embed
// without the dashboard. Usage:
//   ROLLOUT_CLIENT_SECRET=test-secret node scripts/sign-sample.mjs [baseUrl] [--preview] [--person=ID]
// The Rollout dashboard's "Test the signature check" does the same with your real secret.
import { createHmac, randomUUID } from "node:crypto";

const secret = process.env.ROLLOUT_CLIENT_SECRET;
if (!secret) {
  console.error("Set ROLLOUT_CLIENT_SECRET (the same value the app runs with).");
  process.exit(1);
}

const args = process.argv.slice(2);
const base = args.find((a) => !a.startsWith("--")) ?? "http://localhost:3001/embed";
const preview = args.includes("--preview");
const personId = args.find((a) => a.startsWith("--person="))?.slice(9);
const iat = Math.floor(Date.now() / 1000);

const context = preview
  ? {
      context: "person",
      user: { id: "rollout-preview-user", name: "Sample Agent", email: "agent@example.com" },
      person: { firstName: "Sample", lastName: "Contact", stage: { id: "1", name: "Lead" } },
      crm: { accountId: "rollout-preview-account", personId: "rollout-preview-person" },
      org: { id: "rollout-preview-account" },
      x: { platform: "sample", marketplaceId: "mkt_sample", appId: "app_sample", iat, exp: iat + 300, jti: `ctx_${randomUUID()}`, preview: true },
    }
  : {
      context: "person",
      account: { domain: "harbor-pine", owner: { name: "Marcus Bell", email: "marcus@harborpine.example" } },
      user: { id: "usr_dana_okafor", name: "Dana Okafor", email: "dana@harborpine.example" },
      person: { firstName: "Melissa", lastName: "Hartman", stage: { id: "3", name: "Active buyer" } },
      crm: { accountId: "office_harbor_pine", personId: personId ?? "c_melissa_hartman" },
      org: { id: "office_harbor_pine" },
      x: { platform: "sample", marketplaceId: "mkt_sample", appId: "app_sample", iat, exp: iat + 300, jti: `ctx_${randomUUID()}` },
    };

// URL-safe base64 without padding, then HMAC-SHA256 hex of exactly that string.
const encoded = Buffer.from(JSON.stringify(context)).toString("base64url");
const signature = createHmac("sha256", secret).update(encoded).digest("hex");

const url = new URL(base);
url.searchParams.set("context", encoded);
url.searchParams.set("signature", signature);
console.log(url.href);
