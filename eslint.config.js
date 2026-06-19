const js = require('@eslint/js');
const angular = require('@angular-eslint/eslint-plugin');
const angularTemplate = require('@angular-eslint/eslint-plugin-template');
const angularTemplateParser = require('@angular-eslint/template-parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
    {
        ignores: ['dist/**', 'node_modules/**', 'src/assets/**', 'assets/**', 'types/**', '.eslintrc.js'],
    },
    {
        linterOptions: {
            reportUnusedDisableDirectives: 'off',
        },
    },
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            ecmaVersion: 2020,
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json',
                sourceType: 'module',
                tsconfigRootDir: __dirname,
            },
        },
        plugins: {
            '@angular-eslint': angular,
            '@typescript-eslint': tsPlugin,
        },
        rules: {},
    },
    {
        files: ['src/**/*.html'],
        languageOptions: {
            parser: angularTemplateParser,
        },
        plugins: {
            '@angular-eslint/template': angularTemplate,
        },
        rules: {},
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'commonjs',
            globals: {
                __dirname: 'readonly',
                module: 'writable',
                require: 'readonly',
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            'array-bracket-spacing': 'error',
            'arrow-spacing': 'error',
            'brace-style': 'error',
            'comma-spacing': ['error', { before: false, after: true }],
            'comma-style': ['error', 'last'],
            curly: 'error',
            'eol-last': 'error',
            eqeqeq: ['error', 'smart'],
            indent: ['warn', 4],
            'key-spacing': 'error',
            'keyword-spacing': 'error',
            'linebreak-style': ['off', 'unix'],
            'new-parens': 'error',
            'no-console': 'off',
            'no-multiple-empty-lines': 'error',
            'no-multi-spaces': 'error',
            'no-trailing-spaces': 'error',
            'no-var': 'error',
            'no-whitespace-before-property': 'error',
            'object-shorthand': 'error',
            'one-var': ['error', 'never'],
            'prefer-const': 'error',
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            'space-before-function-paren': [
                'error',
                {
                    anonymous: 'never',
                    asyncArrow: 'always',
                    named: 'never',
                },
            ],
            'space-in-parens': 'error',
            'space-infix-ops': 'error',
            'spaced-comment': [
                'error',
                'always',
                {
                    block: {
                        markers: ['!'],
                    },
                },
            ],
        },
    },
];
