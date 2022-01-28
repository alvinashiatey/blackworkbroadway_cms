import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import resolve from "@rollup/plugin-node-resolve";
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  plugins: [
    vue(),
    resolve({
      extensions: [".js", ".ts"],
    }),
  ],
  server: {
    port: 9090,
  },
});
