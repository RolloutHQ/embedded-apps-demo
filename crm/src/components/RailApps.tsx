"use client";

// The sidebar placement: the same apps in a narrow panel above the contact's
// details, the way Follow Up Boss shows embedded apps.

import { useAppsPlacement } from "./AppsPlacement";
import { AppsMount, type RolloutConfig } from "./AppsMount";

export function RailApps(props: { rollout: RolloutConfig; contact: { id: string; firstName: string } }) {
  const { placement, setPlacement, setAppCount } = useAppsPlacement();
  if (placement !== "sidebar") return null;

  return (
    <section className="panel rail-apps" aria-label="Apps">
      <h3>
        Apps
        <button type="button" className="link-button" onClick={() => setPlacement("tab")}>
          Show in the Apps tab
        </button>
      </h3>
      <AppsMount rollout={props.rollout} contact={props.contact} onCount={setAppCount} />
    </section>
  );
}
