import { defineConfig } from "vite";

// base "./" keeps asset URLs relative, so the build works at any GitHub
// Pages path (site root today, anywhere else tomorrow) without config.
export default defineConfig({
  base: "./",
});
