import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// base "./" keeps asset URLs relative, so the build works at any GitHub
// Pages path (deployed under /laphurdikursen/ in the shared artifact).
export default defineConfig({
  base: "./",
  server: {
    fs: {
      // LEXICON.tsv lives at the repo root, two levels above this app.
      allow: [fileURLToPath(new URL("../..", import.meta.url))],
    },
  },
  test: {
    environment: "node",
  },
});
