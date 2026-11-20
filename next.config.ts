
import type { NextConfig } from "next";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://booknote-server-cjcu.onrender.com"
    : "http://localhost:5000");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${BACKEND_URL}/api/auth/:path*`,
      },
      {
        source: "/api/backend/:path*",
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
