"use client";

// Where the contact's apps show: the wide Apps tab, or a narrow panel in the
// right sidebar, as Follow Up Boss places embedded apps. Only one placement
// mounts the apps at a time. The choice lives in the URL (?apps=sidebar), so a
// link can open straight to either.

import { createContext, useContext, useState } from "react";

export type Placement = "tab" | "sidebar";

type PlacementState = {
  placement: Placement;
  setPlacement: (next: Placement) => void;
  appCount: number | null;
  setAppCount: (count: number | null) => void;
};

const PlacementContext = createContext<PlacementState | null>(null);

export function useAppsPlacement(): PlacementState {
  const value = useContext(PlacementContext);
  if (!value) throw new Error("useAppsPlacement must be used inside AppsPlacementProvider");
  return value;
}

export function AppsPlacementProvider(props: { initial: Placement; children: React.ReactNode }) {
  const [placement, setPlacementState] = useState<Placement>(props.initial);
  const [appCount, setAppCount] = useState<number | null>(null);

  const setPlacement = (next: Placement) => {
    setPlacementState(next);
    setAppCount(null);
    const url = new URL(window.location.href);
    if (next === "sidebar") url.searchParams.set("apps", "sidebar");
    else url.searchParams.delete("apps");
    window.history.replaceState(null, "", url);
  };

  return (
    <PlacementContext.Provider value={{ placement, setPlacement, appCount, setAppCount }}>
      <div className="contact" data-apps={placement}>
        {props.children}
      </div>
    </PlacementContext.Provider>
  );
}

export function PlacementToggle() {
  const { placement, setPlacement } = useAppsPlacement();
  return (
    <div className="segmented placement" role="group" aria-label="Where apps show">
      <button type="button" aria-pressed={placement === "tab"} onClick={() => setPlacement("tab")}>
        In this tab
      </button>
      <button type="button" aria-pressed={placement === "sidebar"} onClick={() => setPlacement("sidebar")}>
        In the sidebar
      </button>
    </div>
  );
}
