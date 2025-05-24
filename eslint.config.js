import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import eslintImport from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['build', 'coverage'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended
    ],
    files:           ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals:     globals.browser,
      sourceType:  'module'
    },
    plugins: {
      'react-hooks':   reactHooks,
      'react-refresh': reactRefresh,
      '@stylistic':    stylistic,
      import:          eslintImport
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],

      'import/order': ['error', {
        groups: [
          'builtin',
          'external',
          'internal',
          ['sibling', 'parent'],
          'index',
          'unknown'
        ],
        'newlines-between': 'always',
        alphabetize:        {
          order:           'asc',
          caseInsensitive: true
        }
      }],

      'no-restricted-imports':                    'off',
      '@typescript-eslint/no-restricted-imports': [
        'warn',
        {
          name:        'react-redux',
          importNames: ['useSelector', 'useDispatch'],
          message:     'Use typed hooks `useAppDispatch` and `useAppSelector` instead.'
        }
      ],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      '@stylistic/array-bracket-spacing':          ['error', 'never'],
      '@stylistic/arrow-parens':                   'error',
      '@stylistic/arrow-spacing':                  'error',
      '@stylistic/block-spacing':                  ['error', 'always'],
      '@stylistic/brace-style':                    ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/comma-spacing':                  ['error', { before: false, after: true }],
      '@stylistic/comma-dangle':                   ['error', 'never'],
      '@stylistic/comma-style':                    ['error', 'last'],
      '@stylistic/computed-property-spacing':      ['error', 'never'],
      '@stylistic/curly-newline':                  ['error', { consistent: true }],
      '@stylistic/dot-location':                   ['error', 'property'],
      '@stylistic/eol-last':                       'error',
      '@stylistic/function-call-spacing':          ['error', 'never'],
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/function-paren-newline':         ['off', 'multiline'],
      '@stylistic/implicit-arrow-linebreak':       ['error', 'beside'],
      '@stylistic/indent':                         ['error', 2],
      '@stylistic/indent-binary-ops':              ['error', 2],
      '@stylistic/key-spacing':                    ['error', {
        singleLine: {
          beforeColon: false,
          afterColon:  true
        },
        multiLine: {
          beforeColon: false,
          afterColon:  true,
          align:       'value'
        }
      }],
      '@stylistic/keyword-spacing':          'error',
      '@stylistic/lines-around-comment':     ['error', { beforeBlockComment: true }],
      '@stylistic/member-delimiter-style':   'error',
      '@stylistic/multiline-comment-style':  ['off', 'starred-block'],
      '@stylistic/newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
      '@stylistic/no-extra-semi':            'error',
      '@stylistic/no-floating-decimal':      'error',
      '@stylistic/no-mixed-operators':       'error',
      '@stylistic/no-mixed-spaces-and-tabs': 'error',
      '@stylistic/no-multi-spaces':          ['off', {
        exceptions: {
          Property:        true,
          ImportAttribute: true
        }
      }],
      '@stylistic/no-multiple-empty-lines':       ['error', { max: 2, maxEOF: 0 }],
      '@stylistic/no-trailing-spaces':            'error',
      '@stylistic/no-whitespace-before-property': 'error',
      '@stylistic/object-curly-newline':          ['error', { multiline: true }],
      '@stylistic/object-curly-spacing':          ['error', 'always'],
      '@stylistic/operator-linebreak':            ['error', 'before'],
      '@stylistic/quote-props':                   ['error', 'as-needed'],
      '@stylistic/quotes':                        ['error', 'single'],
      '@stylistic/rest-spread-spacing':           ['error', 'never'],
      '@stylistic/semi':                          'error',
      '@stylistic/semi-spacing':                  'error',
      '@stylistic/space-before-blocks':           'error',
      '@stylistic/space-before-function-paren':   ['error', {
        anonymous:  'always',
        named:      'never',
        asyncArrow: 'always'
      }],
      '@stylistic/space-in-parens':          ['error', 'never'],
      '@stylistic/space-infix-ops':          'error',
      '@stylistic/space-unary-ops':          'error',
      '@stylistic/spaced-comment':           ['error', 'always'],
      '@stylistic/switch-colon-spacing':     'error',
      '@stylistic/template-curly-spacing':   'error',
      '@stylistic/template-tag-spacing':     'error',
      '@stylistic/type-annotation-spacing':  'error',
      '@stylistic/type-generic-spacing':     ['error'],
      '@stylistic/type-named-tuple-spacing': ['error'],
      '@stylistic/wrap-iife':                ['error', 'outside'],
      '@stylistic/wrap-regex':               'error',
      '@stylistic/yield-star-spacing':       ['error', 'after'],

      '@stylistic/jsx-child-element-spacing':    'error',
      '@stylistic/jsx-closing-bracket-location': ['error', 'tag-aligned'],
      '@stylistic/jsx-closing-tag-location':     ['error', 'tag-aligned'],
      '@stylistic/jsx-curly-brace-presence':     ['error', { props: 'never', children: 'never' }],
      '@stylistic/jsx-curly-newline':            ['error', 'consistent'],
      '@stylistic/jsx-curly-spacing':            ['error', { when: 'never', children: true }],
      '@stylistic/jsx-equals-spacing':           ['error', 'never'],
      '@stylistic/jsx-first-prop-new-line':      'error',
      '@stylistic/jsx-function-call-newline':    ['error', 'multiline'],
      '@stylistic/jsx-one-expression-per-line':  'error',
      '@stylistic/jsx-pascal-case':              'error',
      '@stylistic/jsx-props-no-multi-spaces':    'error',
      '@stylistic/jsx-quotes':                   ['error', 'prefer-single'],
      '@stylistic/jsx-self-closing-comp':        'error',
      '@stylistic/jsx-tag-spacing':              ['error', {
        closingSlash:      'never',
        beforeSelfClosing: 'always',
        afterOpening:      'never',
        beforeClosing:     'never'
      }],
      '@stylistic/jsx-wrap-multilines': ['error', {
        declaration:   'parens-new-line',
        assignment:    'parens-new-line',
        return:        'parens-new-line',
        arrow:         'parens-new-line',
        condition:     'parens-new-line',
        logical:       'parens-new-line',
        prop:          'parens-new-line',
        propertyValue: 'parens-new-line'
      }]
    }
  }
);
