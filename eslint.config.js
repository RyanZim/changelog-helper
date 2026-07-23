import { defineConfig, includeIgnoreFile } from 'eslint/config';
import { fileURLToPath } from 'node:url';
import problems from 'eslint-config-problems';
import globals from 'globals';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
  problems,
  includeIgnoreFile(gitignorePath, { gitignoreResolution: true }),
  {
    languageOptions: {
      sourceType: 'module',
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    ignores: ['app/**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['app/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
      },
    },
  },
]);
