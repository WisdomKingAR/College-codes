import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  {
    // React Bits components are vendored source, installed by the shadcn CLI
    // into src/components/. They predate the stricter React Compiler era rules
    // in eslint-plugin-react-hooks 7, so those rules are relaxed here rather
    // than editing third-party code.
    files: ['src/components/*.tsx'],
    rules: {
      'react-hooks/immutability': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'no-empty': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  {
    // shadcn's convention is to export the cva variants alongside the
    // component, which trips the fast-refresh rule.
    files: ['src/components/ui/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },

  {
    // react-three-fiber components drive the scene imperatively inside
    // useFrame, which runs outside React's render phase. The compiler-era
    // immutability rules do not apply to that code and flag its entire purpose.
    files: ['src/three/*.tsx'],
    rules: {
      'react-hooks/immutability': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
)