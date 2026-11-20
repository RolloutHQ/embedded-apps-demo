// Rollout settings for the CRM, all read from the environment.
// Server-only: ROLLOUT_CLIENT_SECRET must never reach the browser.
import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. Copy .env.example to .env.local and fill it in from the Rollout dashboard.`,
    );
  }
  return value;
}

/** Where Rollout serves the host library and the Rollout frame. */
export const rolloutOrigin = new URL(
  process.env.ROLLOUT_ORIGIN || "https://universal.rollout.com",
).origin;

/** The host library: mountEmbeddedApps() and mountEmbeddedAppMarketplace(). */
export const hostLibraryUrl = `${rolloutOrigin}/api/embedded-apps/host-v1.js`;

/** Your marketplace id, from Marketplace → Settings. Safe to send to the page. */
export const marketplaceId = () => required("ROLLOUT_MARKETPLACE_ID");

/** Your client id (tenant id), from the API page. Every token's `iss`. */
export const tenantId = () => required("ROLLOUT_TENANT_ID");

/** Your client secret, from the API page. Signs every user token. */
export const clientSecret = () => required("ROLLOUT_CLIENT_SECRET");

/** True when all three values are set, so pages can explain what's missing. */
export const isConfigured = () =>
  Boolean(
    process.env.ROLLOUT_TENANT_ID &&
      process.env.ROLLOUT_CLIENT_SECRET &&
      process.env.ROLLOUT_MARKETPLACE_ID,
  );
