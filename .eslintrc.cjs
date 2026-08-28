module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: {
      ts: '@typescript-eslint/parser'
    }
  },
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:vue/vue3-recommended', 'prettier'],
  overrides: [
    {
      files: ['*.ts', '*.vue']
    }
  ],
  rules: {
    // -------------------------------
    // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules
    // -------------------------------
    '@typescript-eslint/no-explicit-any': 'off',
    // -------------------------------
    // https://eslint.vuejs.org/rules/
    // -------------------------------
    'vue/multi-word-component-names': 'off'
  }
};
