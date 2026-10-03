/** @type {import('lint-staged').Configuration} */
export default {
  '*.{ts,astro,js,mjs,cjs}': [
    'oxlint --type-aware --fix --max-warnings=0',
    'prettier --write'
  ],
  '*.{css,json,jsonc,md,yml,yaml}': 'prettier --write'
}
