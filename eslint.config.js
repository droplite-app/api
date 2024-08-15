import { defineConfig } from 'eslint';

export default defineConfig({
  ignores: ['node_modules/', 'dist/'], // ignorePatterns yerine ignores
  // diğer konfigürasyon ayarlarınız
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    // kendi kurallarınız
  },
});
