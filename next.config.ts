import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Media uploads run through a Server Action; the default 1 MB body cap
      // rejects normal photos/videos and crashes the page. Allow up to ~105 MB
      // to cover the 100 MB video limit enforced in upload-actions.ts.
      bodySizeLimit: "105mb",
    },
  },
};

export default nextConfig;
