"use client";

// The Apps tab on a contact: mountEmbeddedApps() fills the element with the
// apps this user (or their org) turned on, each in Rollout's frame.

import { useEffect, useRef } from "react";

import {
  loadHostLibrary,
  type EmbedError,
  type EmbeddedAppsHandle,
  type LoadedApp,
} from "./host-library";

export function EmbeddedApps(props: {
  hostLibraryUrl: string;
  marketplaceId: string;
  contactId: string;
  /** Shown in place of the apps when the user has none on. Lives in our page, so our styles apply. */
  emptyState: () => HTMLElement;
  onAppsLoaded?: (apps: LoadedApp[]) => void;
  onError?: (error: EmbedError) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const handle = useRef<EmbeddedAppsHandle | null>(null);

  // Keep the latest callbacks without remounting.
  const callbacks = useRef(props);
  useEffect(() => {
    callbacks.current = props;
  });

  // Mount once.
  const firstContactId = useRef(props.contactId);
  useEffect(() => {
    let cancelled = false;

    loadHostLibrary(props.hostLibraryUrl).then(
      ({ mountEmbeddedApps }) => {
        if (cancelled || !container.current) return;
        handle.current = mountEmbeddedApps(container.current, {
          marketplaceId: props.marketplaceId,
          record: { type: "person", id: firstContactId.current },
          // Our server signs an embed:render token for the contact Rollout asks about.
          getToken: async ({ record }) => {
            const response = await fetch(
              `/api/rollout/apps-token?personId=${encodeURIComponent(record.id)}`,
            );
            if (!response.ok) throw new Error(`Token endpoint answered ${response.status}`);
            return response.text();
          },
          emptyState: callbacks.current.emptyState(),
          onAppsLoaded: (apps) => callbacks.current.onAppsLoaded?.(apps),
          onError: (error) => callbacks.current.onError?.(error),
        });
      },
      () =>
        callbacks.current.onError?.({
          code: "LIBRARY_UNAVAILABLE",
          message: `Couldn't load ${props.hostLibraryUrl}`,
        }),
    );

    return () => {
      cancelled = true;
      handle.current?.unmount();
      handle.current = null;
    };
  }, [props.hostLibraryUrl, props.marketplaceId]);

  // Another contact, same page: setRecord() swaps it without remounting.
  useEffect(() => {
    handle.current?.setRecord({ type: "person", id: props.contactId });
  }, [props.contactId]);

  return <div ref={container} className="rollout-apps" />;
}
