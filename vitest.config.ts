import { defineConfig } from 'vitest/config'

// Hanya logika murni (utils, contract). Tanpa lingkungan Nuxt.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts']
  }
})
