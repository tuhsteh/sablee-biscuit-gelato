// prettier.config.js, .prettierrc.js, prettier.config.cjs, or .prettierrc.cjs

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const { Config } = require('prettier');
const config = {
  arrowParens: 'always',
  bracketSameLine: true,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
};

module.exports = config;
