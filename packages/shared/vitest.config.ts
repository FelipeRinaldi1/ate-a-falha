import { defineConfig, configDefaults } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		globals: true,
		environment: 'node',
		exclude: [...configDefaults.exclude, '**/dist/**'],
		coverage: {
			provider: 'v8',
		},
	},
})
