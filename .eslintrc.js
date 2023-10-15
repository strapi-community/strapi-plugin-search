module.exports= {
  $schema: "https://json.schemastore.org/eslintrc",
  root: true,
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.server.json"],
  },
  plugins: ["@typescript-eslint"],
  ignorePatterns: ["node_modules", "build", "dist","**/.*"],
};
