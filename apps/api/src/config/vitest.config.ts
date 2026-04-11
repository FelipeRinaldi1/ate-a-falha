import { defineConfig } from 'vitest/config'
import path from 'node:path'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
  resolve: {
    alias: [
      {
        find: /^@\/(.*)\.js$/,
        replacement: path.resolve(__dirname, './src/$1.ts')
      }
    ]
  }
})