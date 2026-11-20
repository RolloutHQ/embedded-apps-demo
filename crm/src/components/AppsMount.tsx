"use client";

// The apps for one contact, with the states around them: loading, a hint when
// Rollout never answers, readable errors, and an empty state in our own styles.
// Used by both placements, the Apps tab and the sidebar panel.

import { useEffect, useState } from "react";

import { EmbeddedApps } from "@/rollout/EmbeddedApps";
import type { EmbedError } from "@/rollout/host-library";

import { RolloutError } from "./RolloutError";

export type RolloutConfig =
  | { configured: true; hostLibraryUrl: string; marketplaceId: string }
  | { configured: false };

export function AppsMount(props: {
  rollout: RolloutConfig;
  contact: { id: string; firstName: string };
  onCount?: (count: number) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<EmbedError | null>(null);
  const [slow, setSlow] = useState(false);

  // Rollout shows nothing when this page's origin isn't allowed to frame it, so say what to check.
  useEffect(() => {
    if (loaded || error) return;
    const timer = setTimeout(() => setSlow(true), 8000);
    return () => clearTimeout(timer);
  }, [loaded, error]);

  if (!props.rollout.configured) {
    return (
      <div className="notice">
        Rollout isn&apos;t configured yet. Set <code>ROLLOUT_TENANT_ID</code>, <code>ROLLOUT_CLIENT_SECRET</code> and{" "}
        <code>ROLLOUT_MARKETPLACE_ID</code> in <code>.env.local</code>, then restart.
      </div>
    );
  }

  return (
    <>
      {!loaded && !error && (
        <p className="apps-loading">
          {slow
            ? "Still waiting on Rollout. If this doesn't change, check that this page's origin is listed under Pages that may show the apps in the marketplace's settings, and look for a frame-ancestors error in the console."
            : "Loading apps…"}
        </p>
      )}
      <EmbeddedApps
        hostLibraryUrl={props.rollout.hostLibraryUrl}
        marketplaceId={props.rollout.marketplaceId}
        contactId={props.contact.id}
        emptyState={() => emptyState(props.contact.firstName)}
        onAppsLoaded={(apps) => {
          setLoaded(true);
          setError(null);
          props.onCount?.(apps.length);
        }}
        onError={setError}
      />
      {error && <RolloutError error={error} />}
    </>
  );
}

function emptyState(firstName: string): HTMLElement {
  const box = document.createElement("div");
  box.className = "apps-empty";
  const title = document.createElement("strong");
  title.textContent = "No apps on yet";
  const text = document.createElement("span");
  text.append("Turn on an app in ");
  const link = document.createElement("a");
  link.href = "/settings/apps";
  link.textContent = "Settings, Apps";
  text.append(link, ` and it shows here for ${firstName} and every other contact.`);
  box.append(title, text);
  return box;
}
