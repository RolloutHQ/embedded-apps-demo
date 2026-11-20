import type { NextConfig } from "next";

import { framingHeaders } from "./src/rollout/framing-headers";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // No X-Frame-Options anywhere: Rollout frames /embed inside CRMs.
  async headers() {
    const headers = framingHeaders(process.env);
    return headers.length ? [{ source: "/:path*", headers }] : [];
  },
};

export default nextConfig;
