import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

// base "./" keeps asset URLs relative, so the build works at any GitHub
// Pages path (site root today, anywhere else tomorrow) without config.
// Two HTML entries: Laphurdi at / (the national language leads, per
// Article 4), English at /en/.
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("index.html", import.meta.url)),
        en: fileURLToPath(new URL("en/index.html", import.meta.url)),
      },
    },
  },
});
