module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parserOptions: { ecmaVersion: 8 }, // to enable features such as async/await
  ignorePatterns: ['node_modules/*', '.next/*', '.out/*', '!.prettierrc.js'], // We don't want to lint generated files nor node_modules, but we want to lint .prettierrc.js (ignored by default by eslint)
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  settings: { react: { version: 'detect' } },
  overrides: [
    // This configuration will apply only to TypeScript files
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended', // TypeScript rules
        'plugin:react/recommended', // React rules
        'plugin:react-hooks/recommended', // React hooks rules
        'plugin:jsx-a11y/recommended', // Accessibility rules
      ],
      plugins: [
          'no-switch-statements',
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': ['error'],
        '@typescript-eslint/member-delimiter-style': ['error', {
          'multiline': {
            'delimiter': 'semi',
            'requireLast': true,
          },
          'singleline': {
            'delimiter': 'semi',
            'requireLast': false,
          },
        }],
        '@typescript-eslint/member-ordering': ['error', {
          'default': { 'memberTypes': 'never', 'order': 'alphabetically' },
          'interfaces': ['signature', 'method', 'constructor', 'field'],
        }],

        'brace-style': ['error', 'stroustrup'],
        'comma-dangle': ['error', 'always-multiline'],
        'quotes': ['error', 'single', { 'allowTemplateLiterals': true, 'avoidEscape': true }],
        'indent': ['error', 4],
        'jsx-a11y/anchor-is-valid': 'off',
        'jsx-quotes': ['error', 'prefer-double'],
        'keyword-spacing': ['error', {}],
        'no-console': 'error',
        'no-switch-statements/no-switch': 'error',
        'no-trailing-spaces': 'error',
        'object-curly-spacing': ['error', 'always'],
        'padding-line-between-statements': ['error',
            // imports go together, but last import must be followed by newline
            { blankLine: 'always', prev: 'import', next: '*' },
            { blankLine: 'any', prev: 'import', next: 'import' },

            { blankLine: 'always', prev: 'export', next: '*' },
            { blankLine: 'always', prev: '*', next: 'export' },

            { blankLine: 'always', prev: 'function', next: '*' },
            { blankLine: 'always', prev: '*', next: 'function' },
        ],
        'prefer-const': ['error', {}],
        'react/jsx-closing-bracket-location': ['error', {
            'nonEmpty': 'after-props',
            'selfClosing': 'line-aligned',
        }],
        'react/jsx-closing-tag-location': 'error',
        'react/jsx-curly-brace-presence': 'error',
        'react/jsx-curly-spacing': ['error', {
            'children': true,
            'spacing': {
                'objectLiterals': 'never',
            },
            'when': 'always',
        }],
        'react/jsx-equals-spacing': 'error',
        'react/jsx-handler-names': ['error', {
            'eventHandlerPrefix': 'on',
            'eventHandlerPropPrefix': 'on',
        }],
        'react/jsx-indent': 'error',
        'react/jsx-indent-props': 'error',
        'react/jsx-no-target-blank': 'error',
        'react/jsx-props-no-multi-spaces': 'error',
        'react/jsx-sort-props': ['error', {
          'ignoreCase': true,
          'reservedFirst': true,
        }],
        'react/jsx-tag-spacing': ['error', {
            'beforeClosing': 'never',
            'beforeSelfClosing': 'allow',
        }],
        'react/jsx-wrap-multilines': 'error',
        'react/no-deprecated': 'error',
        'react/no-typos': 'error',
        'react/no-unknown-property': 'error',
        'react/no-unsafe': ['error', {
            'checkAliases': true,
        }],
        'react/no-unused-prop-types': 'error',
        'react/prefer-stateless-function': 'error',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'semi': ['error', 'always'],
        'sort-imports': ['error', {
            'ignoreCase': true,
            'allowSeparatedGroups': true,
            'memberSyntaxSortOrder': ['none', 'all', 'single', 'multiple'],
        }],
        'sort-keys': 'error',
        'sort-vars': 'error',
        'space-before-blocks': ['error', 'always'],
      },
    },
  ],
}
