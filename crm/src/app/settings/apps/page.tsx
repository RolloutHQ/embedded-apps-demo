import type { Metadata } from "next";
import Link from "next/link";

import { MarketplaceSection } from "@/components/MarketplaceSection";
import { Topbar } from "@/components/Topbar";
import { getSignedInKey, USERS } from "@/lib/session";
import { hostLibraryUrl, isConfigured, marketplaceId } from "@/rollout/config";

export const metadata: Metadata = { title: "Apps" };

export default async function AppsSettingsPage() {
  const key = await getSignedInKey();
  const user = USERS[key];
  const admin = user.role === "admin";

  return (
    <>
      <Topbar crumbs={[{ label: "Settings" }, { label: "Apps" }]} right={<span>{user.office.name}</span>} />
      <main className="page">
        <div className="settings">
          <nav className="settings-nav" aria-label="Settings">
            <span>Profile</span>
            <span>Team</span>
            <span>Lead routing</span>
            <Link href="/settings/apps" aria-current="page">Apps</Link>
          </nav>
          <div>
            <div className="page-head">
              <div>
                <h1 className="page-title">Apps</h1>
                <p className="page-sub">
                  Tools from other companies that show on your contacts, in each contact&apos;s Apps tab. Stoop reviews
                  every app before it appears here.
                </p>
              </div>
            </div>
            <div className="role-banner">
              <span className="avatar lg ink">{user.initials}</span>
              <p>
                {admin ? (
                  <>
                    <strong>You&apos;re an org admin.</strong> Turn an app on for yourself, or for everyone at{" "}
                    {user.office.name} at once.
                  </>
                ) : (
                  <>
                    <strong>You&apos;re signed in as an agent.</strong> Apps you turn on show only for you. Apps your
                    broker turned on for the office show as on.
                  </>
                )}
              </p>
            </div>
            {isConfigured() ? (
              <MarketplaceSection hostLibraryUrl={hostLibraryUrl} marketplaceId={marketplaceId()} userKey={key} />
            ) : (
              <div className="notice">
                Rollout isn&apos;t configured yet. Set <code>ROLLOUT_TENANT_ID</code>, <code>ROLLOUT_CLIENT_SECRET</code>{" "}
                and <code>ROLLOUT_MARKETPLACE_ID</code> in <code>.env.local</code>, then restart.
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
