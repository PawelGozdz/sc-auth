module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint/eslint-plugin", "sonarjs", "promise"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:sonarjs/recommended",
    "plugin:promise/recommended"
  ],
  settings: {
    ["import/parsers"]: { "@typescript-eslint/parser": [".ts", ".tsx"] },
    ["import/resolver"]: {
      node: {
        extensions: [".ts"],
      },
    },
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    ".eslintrc.js",
    "jest.config.js",
    "jest-e2e.config.js",
    "bin/**/*",
    "dist/**/*",
  ],
  rules: {
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "interface",
        prefix: ["I"],
        format: ["StrictPascalCase"],
      },
      { selector: "class", format: ["StrictPascalCase"] },
      {
        selector: "variable",
        format: ["PascalCase", "UPPER_CASE"],
        types: ["boolean"],
        prefix: ["is", "should", "has", "can", "did", "will"],
      },
      {
        selector: "function",
        format: ["camelCase"],
      },
      {
        selector: "variableLike",
        format: ["camelCase", "UPPER_CASE", "PascalCase"],
      },
      {
        selector: "parameter",
        format: ["camelCase"],
      },
      {
        selector: "memberLike",
        modifiers: ["private"],
        format: ["camelCase"],
        leadingUnderscore: "forbid",
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
      },
      {
        selector: "property",
        modifiers: ["readonly"],
        format: ["PascalCase"],
      },
      {
        selector: "enumMember",
        format: ["UPPER_CASE"],
      }
    ],
    "eslint-comments/disable-enable-pair": [
      "error",
      { allowWholeFile: true },
    ],
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "sonarjs/cognitive-complexity": "error",
    "sonarjs/no-identical-expressions": "error",
    "promise/always-return": "error",
    "promise/no-return-wrap": "error",
    "promise/param-names": "error",
    "promise/catch-or-return": "error",
    "promise/no-native": "off",
    "promise/no-nesting": "warn",
    "promise/no-promise-in-callback": "warn",
    "promise/no-callback-in-promise": "warn",
    "promise/avoid-new": "warn",
    "promise/no-new-statics": "error",
    "promise/no-return-in-finally": "warn",
    "promise/valid-params": "warn"
  },
};