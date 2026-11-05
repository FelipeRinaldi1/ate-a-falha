import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		globals: true,
		environment: 'node',
		exclude: [...configDefaults.exclude, '**/dist/**'],
		coverage: {
			provider: 'v8',
		},
	},
})
