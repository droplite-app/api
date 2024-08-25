const { ESLint } = require('eslint');

module.exports = {
  ignores: ['node_modules/', 'dist/'],
  languageOptions: {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
  plugins: {
    '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    semi: ['error', 'always'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
