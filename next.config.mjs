import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The repo root has its own package-lock.json; pin the root here so
  // Turbopack stops guessing and warning about it.
  turbopack: { root: path.dirname(fileURLToPath(import.meta.url)) },
  // The dev badge sits bottom-left, right on top of BACK.
  devIndicators: false,
};

export default nextConfig;
