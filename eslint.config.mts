import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "**/knowledge_base/**",
      "**/node_modules/**",
      "**/coderbyte-challenges/**",
    ]
  },
  // General JS configuration
  js.configs.recommended,
  // TypeScript configuration with Node.js globals
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    languageOptions: {
      ...config.languageOptions,
      globals: {
        ...globals.node,
        ...config.languageOptions?.globals
      }
    },
    rules: {
      ...config.rules,
      // Allow underscore-prefixed unused parameters in type definitions
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_|^key$" }],
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_|^key$" }]
    }
  })),
  // Configuration for Node.js JavaScript files
  {
    files: ["ecosystem.config.js", "public/js/lang.js"],
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 2022,
      sourceType: "script"
    },
    rules: {
      "@typescript-eslint/no-unused-expressions": "off"
    }
  },
  // Configuration for browser JavaScript files
  {
    files: ["public/js/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jquery
      },
      ecmaVersion: 2022,
      sourceType: "script"
    },
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
      "no-redeclare": "off"
    }
  }
]);
