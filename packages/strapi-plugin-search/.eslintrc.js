const frontendESLint = require("./.eslintrc.frontend.js");
const backendESLint = require("./.eslintrc.backend.js");

module.exports = {
  $schema: "https://json.schemastore.org/eslintrc",
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["*/tsconfig.json"],
  },
  plugins: ["@typescript-eslint"],
  rules: {
    indent: ["error", "tab"],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
  },
  overrides: [
    {
      files: ["server/**/*"],
      ...backendESLint,
    },
    {
      files: ["admin/**/*"],
      ...frontendESLint,
    },
  ],
};
