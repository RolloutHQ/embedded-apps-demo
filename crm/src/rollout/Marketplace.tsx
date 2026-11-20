"use client";

// Settings → Apps: mountEmbeddedAppMarketplace() lists the apps approved in
// our marketplace, with a switch for each scope this user may turn them on for.

import { useEffect, useRef } from "react";

import {
  loadHostLibrary,
  type EmbedError,
  type EnablementChange,
} from "./host-library";

export function Marketplace(props: {
  hostLibraryUrl: string;
  marketplaceId: string;
  /** Changes when the signed-in user changes, so the marketplace remounts with a new token. */
  userKey: string;
  onEnablementChange?: (change: EnablementChange) => void;
  onError?: (error: EmbedError) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const callbacks = useRef(props);
  useEffect(() => {
    callbacks.current = props;
  });

  useEffect(() => {
    let cancelled = false;
    let unmount: (() => void) | undefined;

    loadHostLibrary(props.hostLibraryUrl).then(
      ({ mountEmbeddedAppMarketplace }) => {
        if (cancelled || !container.current) return;
        const marketplace = mountEmbeddedAppMarketplace(container.current, {
          marketplaceId: props.marketplaceId,
          // embed:enable, plus embed:enable_org when the user is an org admin.
          getToken: async () => {
            const response = await fetch("/api/rollout/marketplace-token");
            if (!response.ok) throw new Error(`Token endpoint answered ${response.status}`);
            return response.text();
          },
          layout: "list",
          onEnablementChange: (change) => callbacks.current.onEnablementChange?.(change),
          onError: (error) => callbacks.current.onError?.(error),
        });
        unmount = marketplace.unmount;
      },
      () =>
        callbacks.current.onError?.({
          code: "LIBRARY_UNAVAILABLE",
          message: `Couldn't load ${props.hostLibraryUrl}`,
        }),
    );

    return () => {
      cancelled = true;
      unmount?.();
    };
  }, [props.hostLibraryUrl, props.marketplaceId, props.userKey]);

  return <div ref={container} className="rollout-marketplace" />;
}
