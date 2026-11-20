"use client";

import { useEffect } from "react";

// Tells the Lintel frame that opened this popup that the agent signed in. The
// frame is on our own origin, so we post to exactly that origin.
export function NotifyOpener() {
  useEffect(() => {
    window.opener?.postMessage("lintel:signed-in", window.location.origin);
    const timer = setTimeout(() => window.close(), 900);
    return () => clearTimeout(timer);
  }, []);
  return null;
}
