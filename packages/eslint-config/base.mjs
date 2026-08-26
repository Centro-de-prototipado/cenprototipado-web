import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import prettierPlugin from "eslint-plugin-prettier"
import { defineConfig, globalIgnores } from "eslint/config"
import tseslint from "typescript-eslint"

// Configuración compartida por los paquetes de librería del monorepo.
// Las apps parten de sus propios presets (Next) y no la usan.
export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  globalIgnores(["dist/**", "node_modules/**", "generated/**", "**/*.types.ts"]),
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      "prettier/prettier": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { args: "none", destructuredArrayIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
    },
  },
])
