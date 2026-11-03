import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // No image server in a static export: lib/imageLoader.ts points srcset at copies made ahead of time
  // (`npm run sizes`). These are their widths, the plates' and the portraits'.
  images: {
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
    deviceSizes: [1280, 1920, 2560, 3072, 4096],
    imageSizes: [160, 320],
  },
  trailingSlash: true,
  // "/" and "/es/" each have their own root layout (app/(en), app/(es)), so the 404 page needs its
  // own document too: app/global-not-found.tsx.
  experimental: { globalNotFound: true },
  // Pin the workspace root to this project so a parent folder's lockfile
  // (e.g. when checked out as a nested git worktree) isn't picked up instead.
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
};

export default nextConfig;
