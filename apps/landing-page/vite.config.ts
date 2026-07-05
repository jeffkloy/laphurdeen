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
        darcambria: fileURLToPath(new URL("darcambria/index.html", import.meta.url)),
        lapentieur: fileURLToPath(new URL("lapentieur/index.html", import.meta.url)),
        agaetisboro: fileURLToPath(new URL("agaetisboro/index.html", import.meta.url)),
        enDarcambria: fileURLToPath(new URL("en/darcambria/index.html", import.meta.url)),
        enLapentieur: fileURLToPath(new URL("en/lapentieur/index.html", import.meta.url)),
        enAgaetisboro: fileURLToPath(new URL("en/agaetisboro/index.html", import.meta.url)),
      },
    },
  },
});
