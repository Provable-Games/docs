import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { vocs } from "vocs/vite";

// Static assets stay in src/public (Vocs 1 layout) rather than Vocs 2's default ./public.
export default defineConfig({
  publicDir: "src/public",
  plugins: [react(), vocs()],
});
