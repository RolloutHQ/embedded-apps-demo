"use client";

// Opens Lintel's sign-in in a popup (never inside the frame: Rollout's frame
// blocks other origins, and popups run outside its sandbox). When the popup
// says the agent signed in, reload() asks Rollout for a freshly signed context,
// and our server finds the new link.

import { useEffect } from "react";

export function ConnectButton(props: { appScriptUrl: string; connectToken: string; children: React.ReactNode }) {
  useEffect(() => {
    const onMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.data !== "lintel:signed-in") return;
      const { reload } = (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ props.appScriptUrl)) as {
        reload: () => void;
      };
      reload();
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [props.appScriptUrl]);

  return (
    <button
      type="button"
      className="connect"
      onClick={() =>
        window.open(
          `/connect?token=${encodeURIComponent(props.connectToken)}`,
          "lintel-connect",
          "popup,width=460,height=620",
        )
      }
    >
      {props.children}
    </button>
  );
}
