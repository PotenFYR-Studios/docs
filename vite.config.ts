import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Serve root-relative absolute assets so SPA deep links (/repo/x, /repos?cat=…)
// always resolve correctly on the custom domain. GitHub Pages serves index.html
// for unknown paths, and the router reads location.pathname directly.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  resolve: { alias: { "~": new URL("./src", import.meta.url).pathname } },
  server: { port: 3000, strictPort: false },
  preview: { port: 4173, strictPort: false },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    chunkSizeWarningLimit: 900,
  },
});
