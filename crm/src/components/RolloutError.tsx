import type { EmbedError } from "@/rollout/host-library";

// What to check for the errors a demo setup usually hits. Codes from Rollout's
// "Errors and troubleshooting" reference.
const HINTS: Record<string, string> = {
  TENANT_NOT_FOUND: "Rollout doesn't know this tenant. Check ROLLOUT_TENANT_ID against the dashboard's API page.",
  INVALID_TOKEN: "Rollout refused the token's signature. Check ROLLOUT_CLIENT_SECRET is an active client secret for this tenant.",
  MARKETPLACE_NOT_FOUND: "No marketplace with this id belongs to the tenant. Check ROLLOUT_MARKETPLACE_ID.",
  TOKEN_UNAVAILABLE: "Stoop's token endpoint failed. Check the server logs.",
  LIBRARY_UNAVAILABLE: "The host library didn't load. Check ROLLOUT_ORIGIN and the network.",
  EMBED_SCOPE_MISSING: "The token lacks the scope this needs.",
};

export function RolloutError({ error }: { error: EmbedError }) {
  return (
    <div className="notice" role="alert" style={{ marginTop: 12 }}>
      <strong>{error.code}</strong>: {HINTS[error.code] ?? error.message}
    </div>
  );
}
