import { defineConfig } from 'vitest/config'
import path from 'node:path'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  // Trazemos de volta o plugin para ele ler o tsconfig automaticamente
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    // 1. A MARRETA: Proíbe o Vitest de chegar perto da pasta dist
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
  resolve: {
    alias: [
      // 2. O FILTRO ESM: Intercepta o import com @ e arranca o .js na força
      {
        find: /^@\/(.*)\.js$/,
        replacement: path.resolve(__dirname, './src/$1.ts')
      }
    ]
  }
})