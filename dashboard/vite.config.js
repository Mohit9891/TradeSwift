import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Kite dashboard — Vite dev server on :3001 (matches Login.jsx redirect)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    strictPort: true,
  },
  preview: {
    port: 3001,
  },
  // allow both VITE_* (new) and REACT_APP_* (legacy CRA names) via import.meta.env
  envPrefix: ["VITE_", "REACT_APP_"],
});
