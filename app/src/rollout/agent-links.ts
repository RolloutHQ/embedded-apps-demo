// Links a CRM agent to a Lintel account, keyed by (x.marketplaceId, user.id) as
// "Identifying the agent" recommends: user ids are only unique per marketplace.
// In memory for the demo; a real app keeps this in its database.
import "server-only";

export type AgentLink = { lintelAccount: string; linkedAt: number };

const globalStore = globalThis as unknown as { __lintelLinks?: Map<string, AgentLink> };
const links = (globalStore.__lintelLinks ??= new Map<string, AgentLink>());

const key = (marketplaceId: string, crmUserId: string) => `${marketplaceId}\u0000${crmUserId}`;

export const findLink = (marketplaceId: string, crmUserId: string) => links.get(key(marketplaceId, crmUserId));

export function saveLink(marketplaceId: string, crmUserId: string, lintelAccount: string) {
  links.set(key(marketplaceId, crmUserId), { lintelAccount, linkedAt: Date.now() });
}
