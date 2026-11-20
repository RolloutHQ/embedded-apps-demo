// Rollout settings for Lintel, all read from the environment.
// Server-only: ROLLOUT_CLIENT_SECRET must never reach the browser.
import "server-only";

/** Your client secret, from the Rollout dashboard's API page (the Current secret). */
export function clientSecret(): string {
  const secret = process.env.ROLLOUT_CLIENT_SECRET;
  if (!secret) {
    throw new Error("ROLLOUT_CLIENT_SECRET is not set. Copy .env.example to .env.local and fill it in.");
  }
  return secret;
}

export const isConfigured = () => Boolean(process.env.ROLLOUT_CLIENT_SECRET);

/** Where Rollout serves its app script. */
export const rolloutOrigin = new URL(process.env.ROLLOUT_ORIGIN || "https://universal.rollout.com").origin;

/** Rollout's app script: says the page is ready, and reports its height. */
export const appScriptUrl = `${rolloutOrigin}/api/embedded-apps/app-v1.js`;
