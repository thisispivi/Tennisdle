import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import nodeResolve from "@rollup/plugin-node-resolve";
import { qrcode } from "vite-plugin-qrcode";
import autoprefixer from "autoprefixer";
import svgLoader from "vite-svg-loader";

export default defineConfig({
  plugins: [vue(), svgLoader(), nodeResolve(), qrcode()],
  base: "/",
  server: {
    watch: { usePolling: true },
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replaceAll("\\\\", "/");

          if (normalizedId.includes("/src/assets/db/")) return "db";

          if (normalizedId.includes("node_modules")) {
            if (normalizedId.includes("vue-router")) return "vendor-vue-router";
            if (normalizedId.includes("vue-i18n")) return "vendor-i18n";
            if (
              normalizedId.includes("@reduxjs/toolkit") ||
              normalizedId.includes("redux-persist")
            )
              return "vendor-redux";

            if (normalizedId.includes("floating-vue"))
              return "vendor-floating-vue";
            if (normalizedId.includes("fuse.js")) return "vendor-fuse";
            if (normalizedId.includes("vue-confetti-explosion"))
              return "vendor-confetti";

            return "vendor";
          }
        },
      },
    },
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
