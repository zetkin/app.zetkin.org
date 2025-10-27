module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parserOptions: { ecmaVersion: 8 }, // to enable features such as async/await
  // We don't want to lint generated files nor node_modules, but we want to lint .prettierrc.js (ignored by default by eslint)
  ignorePatterns: ['node_modules/*', '.next/*', '.out/*', '!.prettierrc.js'],
  extends: ['eslint:recommended', 'next', 'prettier'],
  settings: { react: { version: 'detect' } },
  overrides: [
    // This configuration will apply only to TypeScript files
    {
      files: ['**/*.ts', '**/*.tsx', 'src/**/*.js'],
      parser: '@typescript-eslint/parser',
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      extends: [
        'plugin:@typescript-eslint/recommended', // TypeScript rules
        'plugin:react-hooks/recommended', // React hooks rules
        'plugin:jsx-a11y/recommended', // Accessibility rules
      ],
      plugins: ['no-switch-statements', 'no-only-tests'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            caughtErrors: 'none',
          },
        ],
        '@typescript-eslint/member-ordering': [
          'error',
          {
            default: { memberTypes: 'never', order: 'alphabetically' },
            interfaces: ['signature', 'method', 'constructor', 'field'],
          },
        ],
        curly: 'error',
        'import/order': [
          'error',
          {
            alphabetize: {
              order: 'ignore',
              orderImportKind: 'ignore',
            },
            groups: [['external', 'builtin']],
            'newlines-between': 'always',
          },
        ],
        'jsx-a11y/anchor-is-valid': 'off',
        'no-console': 'error',
        'no-switch-statements/no-switch': 'error',
        'prefer-const': ['error', {}],
        'react/jsx-handler-names': [
          'error',
          {
            eventHandlerPrefix: 'on',
            eventHandlerPropPrefix: 'on',
          },
        ],
        'react/jsx-no-target-blank': 'error',
        'react/jsx-no-useless-fragment': 'error',
        'react/jsx-sort-props': [
          'error',
          {
            ignoreCase: true,
            reservedFirst: true,
          },
        ],
        'react/no-danger': 'error',
        'react/no-deprecated': 'error',
        'react/no-typos': 'error',
        'react/no-unknown-property': 'error',
        'react/no-unsafe': [
          'error',
          {
            checkAliases: true,
          },
        ],
        'react/no-unused-prop-types': 'error',
        'react/prefer-stateless-function': 'error',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'react-hooks/exhaustive-deps': 'off',
        'react/self-closing-comp': [
          'error',
          {
            component: true,
            html: true,
          },
        ],
        'sort-keys': 'error',
        'sort-vars': 'error',
        'no-only-tests/no-only-tests': 'error',
      },
    },
  ],
};
