import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  // Smaller images for phones: AVIF where supported (WebP otherwise); site art is served at
  // quality 55 (see art() in app/art.ts), which is plenty for paintings.
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [55, 75],
  },
  cacheComponents: true,
  partialPrefetching: true,
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
