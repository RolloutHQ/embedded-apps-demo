import type { NextConfig } from "next";

import { contentSecurityPolicy } from "./src/rollout/content-security-policy";

const rolloutOrigin = new URL(process.env.ROLLOUT_ORIGIN || "https://universal.rollout.com").origin;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy({ rolloutOrigin, dev: process.env.NODE_ENV !== "production" }),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
