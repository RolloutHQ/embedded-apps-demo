"use client";

import { useEffect, useState } from "react";

import type { EmbedError } from "@/rollout/host-library";
import { Marketplace } from "@/rollout/Marketplace";

import { RolloutError } from "./RolloutError";

export function MarketplaceSection(props: { hostLibraryUrl: string; marketplaceId: string; userKey: string }) {
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<EmbedError | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <>
      <Marketplace
        hostLibraryUrl={props.hostLibraryUrl}
        marketplaceId={props.marketplaceId}
        userKey={props.userKey}
        onEnablementChange={({ scope, enabled }) => {
          setError(null);
          setToast(
            `${enabled ? "Turned on" : "Turned off"} ${scope === "org" ? "for everyone at Harbor & Pine" : "for you"}`,
          );
        }}
        onError={setError}
      />
      {error && <RolloutError error={error} />}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </>
  );
}
