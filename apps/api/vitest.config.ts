import { defineConfig, configDefaults } from 'vitest/config'
import path from 'path'

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	test: {
		globals: true,
		environment: 'node',
		fileParallelism: false,
		setupFiles: ['./src/tests/setup.ts'],
		exclude: [...configDefaults.exclude, '**/dist/**'],
		coverage: {
			provider: 'v8',
		},
	},
})
