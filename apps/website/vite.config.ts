import { defineConfig } from "vite";
import { globSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// base "./" keeps asset URLs relative, so the build works at any GitHub
// Pages path (site root today, anywhere else tomorrow) without config.
// Entries are discovered: every index.html in the tree is a page, so new
// bilingual pages register themselves. Laphurdi leads at /, English at /en/.
const root = fileURLToPath(new URL(".", import.meta.url));
const input = Object.fromEntries(
  globSync("**/index.html", { cwd: root })
    .filter((p) => !p.includes("node_modules") && !p.startsWith("dist"))
    .map((p) => [dirname(p) === "." ? "main" : dirname(p).replaceAll("/", "-"), join(root, p)]),
);

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: { input },
  },
});
