// Remembers each accepted x.jti until its x.exp, so a copied URL can't be
// opened twice. In memory, which is fine for a demo on one server. In
// production, use Redis (SET jti 1 NX EXAT exp) or a table with a unique key,
// so every instance shares it.
import "server-only";

const globalStore = globalThis as unknown as { __lintelSeenJti?: Map<string, number> };
const seen = (globalStore.__lintelSeenJti ??= new Map<string, number>());

/** Returns false when the jti was already accepted. */
export function rememberJti(jti: string, exp: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  for (const [id, expiry] of seen) if (expiry < now) seen.delete(id);

  if (seen.has(jti)) return false;
  seen.set(jti, exp);
  return true;
}
