import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import jestPlugin from "eslint-plugin-jest";
import sonarjs from "eslint-plugin-sonarjs";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

// const filename = fileURLToPath(import.meta.url); // for config with .js ext
// const dirname = path.dirname(filename);
const dirname = import.meta.dirname;

export default [
  {
    files: ["**/*.ts"],
  },
  {
    ignores: [
      "**/dist/",
      "**/coverage/",
      "eslint.config.*",
      "prettier.config.*",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  sonarjs.configs.recommended,
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      jest: jestPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: "module",
        globals: {
          ...globals.node,
        },
        projectService: true,
        tsconfigRootDir: dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  eslintPluginPrettierRecommended,
  {
    files: ["**/*.spec.ts"],
    ...jestPlugin.configs["flat/recommended"],
  },
  {
    files: ["**/*spec.ts"],
    rules: {
      "sonarjs/no-hardcoded-passwords": "off",
    },
  },
];
