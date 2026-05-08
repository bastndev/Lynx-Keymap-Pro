import typescriptEslint from "typescript-eslint";

export default [{
    ignores: ["dist/**"],
}, {
    files: ["**/*.ts"],
    plugins: {
        "@typescript-eslint": typescriptEslint.plugin,
    },

    languageOptions: {
        parser: typescriptEslint.parser,
        ecmaVersion: 2022,
        sourceType: "module",
        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    rules: {
        "@typescript-eslint/naming-convention": ["warn", {
            selector: "import",
            format: ["camelCase", "PascalCase"],
        }],
        "@typescript-eslint/no-unused-vars": ["warn", {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
        }],
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/await-thenable": "error",

        curly: "warn",
        eqeqeq: "warn",
        "no-throw-literal": "warn",
        "no-console": ["warn", { allow: ["warn", "error", "debug"] }],
        semi: "warn",
    },
}, {
    // JavaScript files (like esbuild.js) - no type checking rules
    files: ["**/*.js", "**/*.mjs"],
    plugins: {
        "@typescript-eslint": typescriptEslint.plugin,
    },

    languageOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
    },

    rules: {
        curly: "warn",
        eqeqeq: "warn",
        "no-throw-literal": "warn",
        "no-console": ["warn", { allow: ["warn", "error", "debug"] }],
        semi: "warn",
    },
}];