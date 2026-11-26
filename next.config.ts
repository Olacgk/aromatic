import type { NextConfig } from "next";

// Images uploaded in the back-office are served by the API (/media/...): allow its host in next/image.
const api = new URL((process.env.API_URL ?? "http://localhost:8010/api").replace(/\/api\/?$/, ""));

const nextConfig: NextConfig = {
  // Allow tunnels (ngrok) to load dev assets, otherwise the page never hydrates.
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok-free.dev", "*.ngrok.app", "*.ngrok.io"],
  images: {
    remotePatterns: [
      {
        protocol: api.protocol.replace(":", "") as "http" | "https",
        hostname: api.hostname,
        ...(api.port ? { port: api.port } : {}),
        pathname: "/media/**",
      },
    ],
    // The API host is on localhost in development; next/image refuses private IPs unless told otherwise.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
