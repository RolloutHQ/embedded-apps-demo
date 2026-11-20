// Framing, per "Build the page": never send X-Frame-Options (Next.js doesn't
// by default). Only if you choose to restrict framing, send a CSP
// frame-ancestors that lists Rollout's origin, the dashboard (for previews)
// and every CRM page the app shows on, because browsers check every ancestor.
//
// Plain module (no "server-only"): next.config.ts imports it at build time.

export function framingHeaders(env: Record<string, string | undefined>): { key: string; value: string }[] {
  const crmOrigins = (env.ROLLOUT_FRAME_ANCESTORS ?? "").split(/[\s,]+/).filter(Boolean);
  if (crmOrigins.length === 0) return []; // No restriction: any page may frame the app.

  const rollout = new URL(env.ROLLOUT_ORIGIN || "https://universal.rollout.com").origin;
  const dashboard = new URL(env.ROLLOUT_DASHBOARD_ORIGIN || "https://dashboard.universal.rollout.com").origin;
  const ancestors = ["'self'", rollout, dashboard, ...crmOrigins.map((o) => new URL(o).origin)];

  return [{ key: "Content-Security-Policy", value: `frame-ancestors ${[...new Set(ancestors)].join(" ")}` }];
}
