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

let unauthorizedHandler: (() => void) | null = null

export function setUnauthorizedHandler(handler: (() => void) | null) {
	unauthorizedHandler = handler
}

api.interceptors.response.use(
	(response) => response,
	(error) => {
		const status = error?.response?.status
		const requestUrl = String(error?.config?.url || '')
		const isAuthEndpoint =
			requestUrl.includes('/users/login') ||
			requestUrl.includes('/users/register') ||
			requestUrl.includes('/users/logout')

		if (status === 401 && !isAuthEndpoint) {
			unauthorizedHandler?.()
		}

		return Promise.reject(error)
	}
)
