import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
  { ignores: ["dist/", "node_modules/", "nasne.js", "util/"] },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: { ...globals.node, ...globals.es2021 } },
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-unused-vars": "error",
    },
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: { ...globals.node, ...globals.es2021 },
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",
    },
  },
  {
    files: ["vitest.config.ts", "tsup.config.ts"],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
  },
]);
