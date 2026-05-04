import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

export default [
  js.configs.recommended,

  {
    files: ["**/*.vue", "**/*.js"],
    languageOptions: {
      parser: vueParser,
    },
    plugins: {
      vue,
    },
    rules: {
      //linting rules to continue on
    },
  },
];