import swaggerJSDoc from 'swagger-jsdoc'
import { ENV } from './env.js'

const options: swaggerJSDoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'API Auth Boilerplate',
			version: '1.0.0',
			description: 'Auth API documentation',
			contact: {
				name: '',
			},
		},
		servers: [
			{
				url: ENV.SERVER_URL || 'http://localhost:3000',
				description: '',
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	},
	apis: ['./src/modules/**/*.routes.ts'],
}

export const swaggerSpec = swaggerJSDoc(options)
