import { useQuery } from '@tanstack/react-query'
import { api } from '../libs/api'

export function useUsers() {
	return useQuery({
		queryKey: ['Users'],
		queryFn: async () => {
			const response = await api.get('/users')
			return response.data
		},
	})
}
