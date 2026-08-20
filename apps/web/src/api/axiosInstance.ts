import axios from 'axios'

if (!import.meta.env.VITE_API_URL) {
	console.warn('VITE_API_URL is not defined. Using default http://localhost:3333')
}

const rawUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1').trim().replace(/\/$/, '')
const apiBaseUrl = rawUrl.endsWith('/api/v1') ? rawUrl : `${rawUrl}/api/v1`

export const api = axios.create({
	baseURL: apiBaseUrl,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
})
