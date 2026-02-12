import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import noUnsanitized from "eslint-plugin-no-unsanitized";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    plugins: {
      "typescript-eslint": tseslint.plugin,
      nounsanitized: noUnsanitized,
      "simple-import-sort": simpleImportSort,
    },
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".vue"],
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/no-reserved-component-names": "off",
      "@typescript-eslint/no-unused-expressions": "off",

      "nounsanitized/method": "error",
      "nounsanitized/property": "error",

      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
    },
  },
  {
    files: ["eslint.config.js", "vite.config.*", "*.config.*", "*.cjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  eslintConfigPrettier
);
