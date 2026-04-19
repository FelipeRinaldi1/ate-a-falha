import axios from 'axios'

if (!import.meta.env.VITE_API_URL) {
	console.warn('VITE_API_URL is not defined. Using default http://localhost:3333')
}

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
	headers: {
		'Content-Type': 'application/json',
	},
})
