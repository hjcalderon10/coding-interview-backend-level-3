import tseslint from "typescript-eslint"
import js from "@eslint/js"
import prettier from "eslint-config-prettier"

export default [
  js.configs.recommended,
  tseslint.configs.recommended,
  prettier,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      'prettier/prettier': ['error', { singleQuote: true, semi: false }],
      'max-len': 'off',
    },
  },
]
