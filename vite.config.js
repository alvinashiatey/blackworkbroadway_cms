import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import  { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src/"),
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
