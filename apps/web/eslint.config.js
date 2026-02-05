import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as reactConfig } from "@repo/eslint-config/react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  ...reactConfig,
  {
    ignores: ["eslint.config.js", "dist/**"],
  },
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: __dirname,
      },
    },
  },
];
