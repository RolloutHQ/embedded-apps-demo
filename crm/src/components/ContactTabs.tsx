"use client";

import Link from "next/link";
import { useState } from "react";

import { PlacementToggle, useAppsPlacement } from "./AppsPlacement";
import { AppsMount, type RolloutConfig } from "./AppsMount";
import { ActivityIcon } from "./icons";

type Tab = "overview" | "activity" | "apps";

export function ContactTabs(props: {
  initialTab: Tab;
  contact: { id: string; firstName: string };
  activity: { kind: string; text: string; when: string }[];
  stats: { label: string; value: string }[];
  rollout: RolloutConfig;
}) {
  const { placement, setPlacement, appCount, setAppCount } = useAppsPlacement();
  const [tab, setTab] = useState<Tab>(props.initialTab);
  // Mount the apps the first time the tab opens, then keep them mounted.
  const [appsOpened, setAppsOpened] = useState(props.initialTab === "apps");

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
    { id: "apps", label: "Apps", badge: appCount ? String(appCount) : undefined },
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
          <PlacementToggle />
          <Link href="/settings/apps">Manage apps</Link>
        </div>
        {placement === "sidebar" ? (
          <div className="apps-moved">
            <strong>Apps are in the sidebar</strong>
            <span>
              The same apps, in a narrow panel next to {props.contact.firstName}&apos;s details, the way Follow Up Boss
              shows them.{" "}
              <button type="button" className="link-button" onClick={() => setPlacement("tab")}>
                Show them here instead
              </button>
            </span>
          </div>
        ) : (
          appsOpened && <AppsMount rollout={props.rollout} contact={props.contact} onCount={setAppCount} />
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
