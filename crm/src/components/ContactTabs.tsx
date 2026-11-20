"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { EmbeddedApps } from "@/rollout/EmbeddedApps";
import type { EmbedError, LoadedApp } from "@/rollout/host-library";

import { ActivityIcon } from "./icons";
import { RolloutError } from "./RolloutError";

type Tab = "overview" | "activity" | "apps";
type RolloutProps =
  | { configured: true; hostLibraryUrl: string; marketplaceId: string }
  | { configured: false };

export function ContactTabs(props: {
  initialTab: Tab;
  contact: { id: string; firstName: string };
  activity: { kind: string; text: string; when: string }[];
  stats: { label: string; value: string }[];
  rollout: RolloutProps;
}) {
  const [tab, setTab] = useState<Tab>(props.initialTab);
  // Mount the apps the first time the tab opens, then keep them mounted.
  const [appsOpened, setAppsOpened] = useState(props.initialTab === "apps");
  const [apps, setApps] = useState<LoadedApp[] | null>(null);
  const [error, setError] = useState<EmbedError | null>(null);
  const [slow, setSlow] = useState(false);

  // Rollout shows nothing when this page's origin isn't allowed to frame it, so say what to check.
  useEffect(() => {
    if (!appsOpened || apps !== null || error) return;
    const timer = setTimeout(() => setSlow(true), 8000);
    return () => clearTimeout(timer);
  }, [appsOpened, apps, error]);

  const select = (next: Tab) => {
    setTab(next);
    if (next === "apps") setAppsOpened(true);
    const url = new URL(window.location.href);
    if (next === "overview") url.searchParams.delete("tab");
    else url.searchParams.set("tab", next);
    window.history.replaceState(null, "", url);
  };

  const tabs: { id: Tab; label: string; badge?: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "activity", label: "Activity", badge: String(props.activity.length) },
    { id: "apps", label: "Apps", badge: apps && apps.length > 0 ? String(apps.length) : undefined },
  ];

  return (
    <>
      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            type="button"
            className="tab"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => select(t.id)}
          >
            {t.label}
            {t.badge && <span className="badge">{t.badge}</span>}
          </button>
        ))}
      </div>

      <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" hidden={tab !== "overview"}>
        <dl className="overview">
          {props.stats.map((s) => (
            <div className="stat" key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
        <h2 className="section-title">Recent activity</h2>
        <Timeline items={props.activity.slice(0, 3)} />
      </div>

      <div id="panel-activity" role="tabpanel" aria-labelledby="tab-activity" hidden={tab !== "activity"}>
        <Timeline items={props.activity} />
      </div>

      <div id="panel-apps" role="tabpanel" aria-labelledby="tab-apps" hidden={tab !== "apps"}>
        <div className="apps-head">
          <p>Apps you or your office turned on, showing what they know about {props.contact.firstName}.</p>
          <Link href="/settings/apps">Manage apps</Link>
        </div>
        {!props.rollout.configured ? (
          <div className="notice">
            Rollout isn&apos;t configured yet. Set <code>ROLLOUT_TENANT_ID</code>, <code>ROLLOUT_CLIENT_SECRET</code> and{" "}
            <code>ROLLOUT_MARKETPLACE_ID</code> in <code>.env.local</code>, then restart.
          </div>
        ) : (
          appsOpened && (
            <>
              {apps === null && !error && (
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
                emptyState={() => {
                  const box = document.createElement("div");
                  box.className = "apps-empty";
                  const title = document.createElement("strong");
                  title.textContent = "No apps on yet";
                  const text = document.createElement("span");
                  text.append("Turn on an app in ");
                  const link = document.createElement("a");
                  link.href = "/settings/apps";
                  link.textContent = "Settings, Apps";
                  text.append(link, ` and it shows here for ${props.contact.firstName} and every other contact.`);
                  box.append(title, text);
                  return box;
                }}
                onAppsLoaded={(loaded) => {
                  setApps(loaded);
                  setError(null);
                }}
                onError={setError}
              />
              {error && <RolloutError error={error} />}
            </>
          )
        )}
      </div>
    </>
  );
}

function Timeline({ items }: { items: { kind: string; text: string; when: string }[] }) {
  return (
    <ul className="timeline">
      {items.map((item, i) => (
        <li key={i}>
          <span className="kind">
            <ActivityIcon kind={item.kind} />
          </span>
          <span>{item.text}</span>
          <time>{item.when}</time>
        </li>
      ))}
    </ul>
  );
}
