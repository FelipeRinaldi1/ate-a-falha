import { ENV } from './config/env.js'
import app from './app.js'
import { prisma } from '@ate-a-falha/database'

const PORT = ENV.PORT

async function main() {
	await prisma.$connect()
	const server = app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`)
	})

	const shutdown = async (signal: string) => {
		console.log(`\n${signal} signal received. Starting graceful shutdown...`)

		server.close(async () => {
			console.log('HTTP server closed.')
			await prisma.$disconnect()
			console.log('Database connection closed.')
			process.exit(0)
		})

		setTimeout(() => {
			console.error('Could not close connections in time, forcefully shutting down')
			process.exit(1)
		}, 9000)
	}

	process.on('SIGTERM', () => shutdown('SIGTERM'))
	process.on('SIGINT', () => shutdown('SIGINT'))
}

main().catch((e: any) => {
	console.error(e.message)
	process.exit(1)
})
