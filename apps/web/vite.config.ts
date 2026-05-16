import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '../../', '')

	return {
		plugins: [react(), tsconfigPaths()],
		server: {
			watch: {
				usePolling: true,
			},
			port: parseInt(env.WEB_PORT || '3000'),
			host: true,
			strictPort: true,
		},
	}
})
