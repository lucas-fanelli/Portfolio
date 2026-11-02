import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // "/" and "/es/" each have their own root layout (app/(en), app/(es)), so the 404 page needs its
  // own document too: app/global-not-found.tsx.
  experimental: { globalNotFound: true },
  // Pin the workspace root to this project so a parent folder's lockfile
  // (e.g. when checked out as a nested git worktree) isn't picked up instead.
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
};

export default nextConfig;
