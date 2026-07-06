import { defineConfig } from "vite";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";

// base "./" keeps asset URLs relative, so the build works at any GitHub
// Pages path (site root today, anywhere else tomorrow) without config.
// Entries are discovered: every index.html in the tree is a page, so new
// bilingual pages register themselves. Laphurdi leads at /, English at /en/.
const root = fileURLToPath(new URL(".", import.meta.url));
const SKIP = new Set(["node_modules", "dist", "src", ".git"]);

function htmlEntries(dir: string = root, entries: Record<string, string> = {}) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    if (item.isDirectory()) {
      if (!SKIP.has(item.name)) htmlEntries(join(dir, item.name), entries);
    } else if (item.name === "index.html") {
      const rel = relative(root, dir);
      entries[rel === "" ? "main" : rel.replaceAll("/", "-")] = join(dir, "index.html");
    }
  }
  return entries;
}

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: htmlEntries(),
    },
  },
});
