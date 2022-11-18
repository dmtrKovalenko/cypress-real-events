// eslint-disable-next-line
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "cypress", "no-only-tests"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:cypress/recommended",
  ],
  rules: {
    "no-only-tests/no-only-tests": "error"
  },
};
