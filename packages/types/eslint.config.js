import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as baseConfig } from '@repo/eslint-config/base';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  ...baseConfig,
  {
    ignores: ['eslint.config.js', 'dist/**'],
  },
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
];
