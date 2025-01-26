import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import nodeResolve from "@rollup/plugin-node-resolve";
import { qrcode } from "vite-plugin-qrcode";
import autoprefixer from "autoprefixer";
import svgLoader from "vite-svg-loader";

export default defineConfig({
  plugins: [vue(), svgLoader(), nodeResolve(), qrcode(), svgLoader()],
  base: "/",
  server: {
    watch: { usePolling: true },
    host: true,
  },
  css: {
    postcss: {
      plugins: [autoprefixer({})],
    },
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
});
