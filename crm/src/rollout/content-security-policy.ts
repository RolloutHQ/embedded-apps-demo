// The Content-Security-Policy the CRM's pages send, applied in next.config.ts.
// Rollout's part is the four directives from "Your page's Content Security
// Policy": the library (script-src), the Rollout frame (frame-src), the
// marketplace's requests (connect-src) and the app icons Rollout hosts
// (img-src). Nothing from any app publisher: apps load inside the Rollout frame.
//
// Plain module (no "server-only"): next.config.ts imports it at build time.

export function contentSecurityPolicy(opts: {
  rolloutOrigin: string;
  dev: boolean;
}): string {
  const rollout = opts.rolloutOrigin;
  return [
    "default-src 'self'",
    // 'unsafe-inline' is for Next.js's own inline bootstrap scripts, and
    // 'unsafe-eval' only for its dev server. Use nonces in production if you prefer.
    `script-src 'self' 'unsafe-inline' ${opts.dev ? "'unsafe-eval' " : ""}${rollout}`,
    `frame-src ${rollout}`,
    `connect-src 'self' ${rollout}${opts.dev ? " ws: wss:" : ""}`,
    `img-src 'self' data: ${rollout}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "object-src 'none'",
    "base-uri 'self'",
  ].join("; ");
}
