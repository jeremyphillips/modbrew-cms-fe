export default {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended'
  ],
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  settings: {
    react: { version: 'detect' }
  },
  rules: {
    // TODO: custom rules
  }
};
