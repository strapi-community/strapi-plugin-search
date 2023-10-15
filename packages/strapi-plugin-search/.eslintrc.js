const base = require("../../.eslintrc.js");

module.exports = {
  ...base,
  global:{
    strapi,
  },
  ignorePatterns: [...base.ignorePatterns,'strapi-admin.js','strapi-server.js'],
  overrides: [
    {
      files: ["./admin/**/*.{ts,tsx}"],
      extends: [...base.extends,"plugin:react/recommended"],
      settings: {
        react: {
          version: "detect",
        },
      },
    },
  ],
};
