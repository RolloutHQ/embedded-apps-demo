import type { Metadata } from "next";

import { LintelMark } from "@/components/LintelMark";
import { connectAgent } from "@/rollout/connect-actions";
import { readConnectToken } from "@/rollout/connect-token";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Connect Lintel", robots: { index: false } };

type Props = { searchParams: Promise<{ token?: string; expired?: string }> };

export default async function ConnectPage({ searchParams }: Props) {
  const { token } = await searchParams;
  const claims = readConnectToken(token);

  return (
    <main className="connect-page">
      <div className="connect-card">
        <span className="wordmark">
          <LintelMark /> Lintel
        </span>
        {claims ? (
          <>
            <h1>Connect your Lintel website</h1>
            <p>
              Link {claims.name ? <strong>{claims.name}</strong> : "this agent"} in your CRM to your Lintel account, so
              Lintel shows your leads&apos; activity on every contact.
            </p>
            <form action={connectAgent}>
              <input type="hidden" name="token" value={token} />
              <label>
                Work email
                <input type="email" name="email" defaultValue={claims.email ?? ""} readOnly />
              </label>
              <button type="submit" className="primary">Sign in and connect</button>
            </form>
            <p className="fine">Demo sign-in: no password needed. A real app signs the agent in here.</p>
          </>
        ) : (
          <>
            <h1>This sign-in link has expired</h1>
            <p>Close this window and choose Connect Lintel on the contact again.</p>
          </>
        )}
      </div>
    </main>
  );
}
