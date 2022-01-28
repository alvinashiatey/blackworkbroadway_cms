import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import resolve from "@rollup/plugin-node-resolve";

// https://vitejs.dev/config/
export default defineConfig({
  // resolve: {
  //   alias: {
  //     "@": resolve(__dirname, "./src"),
  //   },
  // },

  plugins: [
    vue(),
    resolve({
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    }),
  ],
  server: {
    port: 9090,
  },
});
