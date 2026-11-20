// The app URL registered with Rollout. Every launch arrives as
// /embed?context=…&signature=…; we verify it on the server before showing
// anything, then load Rollout's app script so Rollout shows and sizes us.
import type { Metadata } from "next";

import { LeadPanel } from "@/components/LeadPanel";
import { LintelMark } from "@/components/LintelMark";
import { leadIntel } from "@/lib/leads";
import { findLink } from "@/rollout/agent-links";
import { RolloutAppScript } from "@/rollout/AppScript";
import { appScriptUrl, clientSecret, isConfigured } from "@/rollout/config";
import { ConnectButton } from "@/rollout/ConnectButton";
import { issueConnectToken } from "@/rollout/connect-token";
import { verifyContext } from "@/rollout/verify-context";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Lintel", robots: { index: false } };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function EmbedPage({ searchParams }: Props) {
  const params = await searchParams;
  const context = isConfigured()
    ? verifyContext(first(params.context), first(params.signature), clientSecret())
    : null;

  // No valid context: say so, and never load the app script, so inside a CRM
  // Rollout keeps the frame hidden rather than showing an error.
  if (!context) {
    return (
      <main className="refused">
        <LintelMark size={28} />
        <h1>Open Lintel from your CRM</h1>
        <p>
          {isConfigured()
            ? "This link is invalid, has expired, or was already used. Open the contact's Apps tab again for a fresh one."
            : "ROLLOUT_CLIENT_SECRET isn't set, so Lintel can't check where this link came from."}
        </p>
      </main>
    );
  }

  const preview = context.x.preview === true;
  // Never link a preview's made-up agent to an account.
  const link = preview ? undefined : findLink(context.x.marketplaceId, context.user.id);

  const account = preview ? (
    <span className="chip">Preview</span>
  ) : link ? (
    <span className="chip connected">Connected to {link.lintelAccount}</span>
  ) : (
    <ConnectButton
      appScriptUrl={appScriptUrl}
      connectToken={issueConnectToken({
        marketplaceId: context.x.marketplaceId,
        userId: context.user.id,
        name: context.user.name,
        email: context.user.email,
      })}
    >
      Connect Lintel
    </ConnectButton>
  );

  return (
    <>
      <RolloutAppScript />
      <LeadPanel
        intel={leadIntel(context.crm.personId, context.person?.firstName)}
        agentName={context.user.name}
        preview={preview}
        account={account}
      />
    </>
  );
}
