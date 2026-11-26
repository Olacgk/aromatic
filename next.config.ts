import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow tunnels (ngrok) to load dev assets, otherwise the page never hydrates.
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok-free.dev", "*.ngrok.app", "*.ngrok.io"],
  /* config options here */
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
