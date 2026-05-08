import typescriptEslint from "typescript-eslint";

export default [{
    ignores: ["dist/**"],
}, {
    files: ["**/*.ts"],
}, {
    plugins: {
        "@typescript-eslint": typescriptEslint.plugin,
    },

    languageOptions: {
        parser: typescriptEslint.parser,
        ecmaVersion: 2022,
        sourceType: "module",
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
}];