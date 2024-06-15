/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  "$schema": "https://typedoc.org/schema.json",
  "out": "docs",
  "plugin": ['@8hobbies/typedoc-plugin-404','typedoc-theme-reference-declaration-test'],
  "theme": 'default',
  "page404SuppressDefaultThemeWarning": true,
  "excludePrivate": true,
  "includes": ["src"],
  "entryPoints": ["src/index.ts"],
  "page404Content": "This page does not exist."
};