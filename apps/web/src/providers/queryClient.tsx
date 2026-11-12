import { MutationCache, QueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { translateError } from '../utils/errorTranslator'

export const queryClient = new QueryClient({
	mutationCache: new MutationCache({
		onError: (error, _variables, _context, mutation) => {
			if (mutation.options.onError) return
			notifications.show({
				color: 'red',
				title: 'Erro',
				message: translateError(error, 'Ocorreu um erro ao processar sua solicitação.'),
			})
		},
	}),
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
		},
	},
})
