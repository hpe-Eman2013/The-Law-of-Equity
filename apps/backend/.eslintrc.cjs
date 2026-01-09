module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  env: { node: true, es2020: true },
  parserOptions: { sourceType: "module", ecmaVersion: "latest" },
  ignorePatterns: ["dist/**"],
};
