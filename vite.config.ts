// @ts-ignore: type declarations for Vite
import { defineConfig } from "vite";
// @ts-ignore: type declarations for plugin-react
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite acesso pelo IP do PC
    port: 8100, // Ou outro que preferir
  },
  build: {
    chunkSizeWarningLimit: 5000,
  },
});
