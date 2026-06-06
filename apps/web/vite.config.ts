import { defineConfig, loadEnv } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '')

	return {
		plugins: [
			react(),
			basicSsl(),
			VitePWA({
				injectRegister: null,
				registerType: 'prompt',
				manifest: {
					name: 'Até a Falha',
					short_name: 'Até a Falha',
					description: 'Sistema de Gerenciamento de Dietas e Treinos',
					theme_color: '#1a1b1e',
					background_color: '#1a1b1e',
					display: 'standalone',
					icons: [
						{
							src: 'pwa-192x192.png',
							sizes: '192x192',
							type: 'image/png',
						},
						{
							src: 'pwa-512x512.png',
							sizes: '512x512',
							type: 'image/png',
						},
					],
				},
			}),
		],
		resolve: {
			tsconfigPaths: true,
		},
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
