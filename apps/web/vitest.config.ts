import { defineConfig } from "vitest/config"
// eslint-disable-next-line import/no-nodejs-modules -- archivo de config que corre en Node
import { resolve } from "node:path"

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/__tests__/**/*.test.ts", "**/*.test.ts"],
  },
  resolve: {
    // El alias "@/*" mapea a la raíz de apps/web (mismo que tsconfig).
    alias: { "@": resolve(__dirname, ".") },
  },
})
