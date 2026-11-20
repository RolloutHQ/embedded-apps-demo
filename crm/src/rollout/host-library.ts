// Loads Rollout's host library in the browser, from Rollout's origin, at
// runtime. It isn't an npm package: Rollout serves and updates it at a stable
// URL. These types describe the parts of it this CRM uses.

export type EmbedRecord = { type: "person"; id: string };
export type EmbedError = { code: string; message: string };
export type LoadedApp = { id: string; name: string };

export type EmbeddedAppsHandle = {
  setRecord: (record: EmbedRecord) => void;
  refresh: () => void;
  unmount: () => void;
};

export type EnablementChange = {
  appId: string;
  scope: "user" | "org";
  enabled: boolean;
};

export type MarketplaceHandle = { refresh: () => void; unmount: () => void };

export type HostLibrary = {
  mountEmbeddedApps: (
    container: Element,
    options: {
      marketplaceId: string;
      record: EmbedRecord;
      getToken: (request: { record: EmbedRecord }) => Promise<string>;
      minHeight?: number;
      maxHeight?: number;
      emptyState?: Node;
      onAppsLoaded?: (apps: LoadedApp[]) => void;
      onError?: (error: EmbedError) => void;
    },
  ) => EmbeddedAppsHandle;
  mountEmbeddedAppMarketplace: (
    container: Element,
    options: {
      marketplaceId: string;
      getToken: () => Promise<string>;
      scopes?: ("user" | "org")[];
      appId?: string;
      layout?: "grid" | "list";
      onEnablementChange?: (change: EnablementChange) => void;
      onError?: (error: EmbedError) => void;
    },
  ) => MarketplaceHandle;
};

let loading: Promise<HostLibrary> | undefined;

/** Imports https://universal.rollout.com/api/embedded-apps/host-v1.js once. */
export function loadHostLibrary(url: string): Promise<HostLibrary> {
  loading ??= import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url) as Promise<HostLibrary>;
  return loading;
}
