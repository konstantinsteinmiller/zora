import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import pluginPug from 'eslint-plugin-pug'
import prettier from 'eslint-plugin-prettier/recommended'
import vueConfigTypescript from '@vue/eslint-config-typescript'
import vueConfigPrettier from '@vue/eslint-config-prettier'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // js
  pluginJs.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
  // ts
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'max-params': ['error', 5],
      'max-len': [0, 80, 2, { ignoreUrls: true }],
      'prettier/prettier': [
        'warn',
        {
          // bracketSameLine: false,
          printWidth: 120,
          singleAttributePerLine: true,
          singleQuote: true,
          semi: false,
          tabWidth: 2,
          trailingComma: 'es5',
          arrowParens: 'avoid',
        },
      ],
    },
  },

  // Pug rules for .pug files
  {
    files: ['**/*.pug', '**/*.vue'],
    plugins: {
      pug: pluginPug,
    },
    rules: {
      // 'pug/no-unused-vars': 'error',
    },
    processor: 'pug/pug', // This enables Pug template parsing
  },

  // vue
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['*.vue', '**/*.vue'],
    plugins: {
      vue: pluginVue,
    },
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      ...vueConfigTypescript.rules,
      ...vueConfigPrettier.rules,
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'prettier/prettier': [
        'warn',
        {
          // bracketSameLine: false,
          printWidth: 120,
          singleAttributePerLine: true,
          singleQuote: true,
          semi: false,
          tabWidth: 2,
          trailingComma: 'es5',
          arrowParens: 'avoid',
        },
      ],
      'vue/multi-word-component-names': 'off',
      'vue/attribute-hyphenation': 'error',
      'vue/no-v-html': 'off',
      'vue/v-on-event-hyphenation': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      'no-else-return': ['error', { allowElseIf: false }],
      'no-multi-spaces': ['error', { ignoreEOLComments: true }],
      'prefer-template': 'error',
      'array-bracket-spacing': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      curly: 'error',
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 3,
          multiline: 1,
        },
      ],
      'vue/html-closing-bracket-newline': ['error', { multiline: 'always', singleline: 'never' }],
      'vue/html-closing-bracket-spacing': ['error', { selfClosingTag: 'always' }],
      'vue/prop-name-casing': ['error', 'camelCase'],
      'vue/order-in-components': ['error'],
      'vue/script-indent': ['off', 2, { baseIndent: 0, switchCase: 0 }],

      'jest/no-disabled-tests': 'off',
    },
  },
  // prettier
  prettier,
  {
    rules: {
      'prettier/prettier': [
        'warn',
        {
          // bracketSameLine: false,
          printWidth: 120,
          singleAttributePerLine: true,
          singleQuote: true,
          semi: false,
          tabWidth: 2,
          trailingComma: 'es5',
          arrowParens: 'avoid',
        },
      ],
    },
  },

  // Ignore patterns
  {
    ignores: ['node_modules', '.nuxt', '.output', 'dist', '**/*.d.ts'],
  },
]
