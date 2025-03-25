module.exports = {
  extends: ['plugin:vue/vue3-recommended', '@vue/typescript/recommended'],
  rules: {
    'vue/no-unused-components': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        varsIgnorePattern: '^[A-Z]', // Ignore all PascalCase variables (components)
        argsIgnorePattern: '^_',
      },
    ],
  },
}
