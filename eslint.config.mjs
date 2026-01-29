import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // Ignore build output
  {
    ignores: ['dist', 'build', 'node_modules']
  },

  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  // React + TS files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      /* -----------------------------
       * React
       * ----------------------------- */
      'react/react-in-jsx-scope': 'off', // Vite / new JSX transform
      'react/jsx-uses-react': 'off',

      /* -----------------------------
       * React Hooks
       * ----------------------------- */
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      /* -----------------------------
       * Vite HMR
       * ----------------------------- */
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],

      /* -----------------------------
       * TypeScript
       * ----------------------------- */
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports' }
      ],

      /* -----------------------------
       * General code quality
       * ----------------------------- */
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  }
]
