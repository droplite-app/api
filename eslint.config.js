const path = require('path');

module.exports = {
  ignorePatterns: ["node_modules", "dist"], // Dosyaları yok sayma
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
  },
  overrides: [
    {
      files: ["*.ts"], // Sadece TypeScript dosyaları için geçerli
      parserOptions: {
        project: path.resolve(__dirname, "tsconfig.json"),
      },
    },
  ],
};
