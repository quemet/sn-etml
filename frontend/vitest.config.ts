/// <reference types="vitest/config" />

import { fileURLToPath, URL } from 'node:url'

export default {
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    exclude: ['e2e/**'],
    root: fileURLToPath(new URL('./', import.meta.url)),
  },
}
