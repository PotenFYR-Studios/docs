import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Serve root-relative assets. On GitHub Pages with the custom domain
// docs.potenfyr.in the site is served at "/", so "./" base keeps assets
// working for both the custom domain and any fallback project URL.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
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
