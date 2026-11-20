import type { Metadata } from "next";

import { LintelMark } from "@/components/LintelMark";
import { NotifyOpener } from "@/rollout/NotifyOpener";

export const metadata: Metadata = { title: "Connected", robots: { index: false } };

export default function ConnectedPage() {
  return (
    <main className="connect-page">
      <div className="connect-card">
        <span className="wordmark">
          <LintelMark /> Lintel
        </span>
        <h1>You&apos;re connected</h1>
        <p>Lintel is reloading on the contact. You can close this window.</p>
        <NotifyOpener />
      </div>
    </main>
  );
}
