module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module'
    },
    env: {
        browser: true,
        node: true,
        es6: true
    },
    extends: ['plugin:vue/recommended', 'eslint:recommended'],
    globals: {
        HdSmart: true
    },
    // add your custom rules here
    //it is base on https://github.com/vuejs/eslint-config-vue
    rules: {
        'arrow-parens': 0,
        'no-console': 'off',
        // semi: [2, 'never'],
        'space-before-function-paren': [2, 'never'],
        'no-new': 0,
        'no-undef': 0,
        'comma-spacing': 0,
        'space-infix-ops': 0,
        'space-in-parens': 0,
        'spaced-comment': 0,
        'no-tabs': 0,
        indent: 0,
        'operator-linebreak': 0,
        'space-before-blocks': 0,
        'comma-dangle': 0,
        'no-mixed-operators': 0,
        'eol-last': 0,
        'prefer-promise-reject-errors': 0,
        'vue/require-prop-types': 'off',
        'vue/require-default-prop': 'off',
        'vue/require-v-for-key': 'off'
    }
}
