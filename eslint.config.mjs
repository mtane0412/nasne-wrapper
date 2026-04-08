import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";


export default defineConfig([
  { ignores: [".eslintrc.js"] },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: { ...globals.node, ...globals.es2021 } },
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-unused-vars": "error",
    },
  },
]);