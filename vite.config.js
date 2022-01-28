import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { nodeResolve } from "@rollup/plugin-node-resolve";
const { resolve } = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve("src/"),
    },
  },
  plugins: [
    vue(),
    nodeResolve({
      extensions: [".js", ".ts"],
    }),
  ],
  server: {
    port: 9090,
  },
});
