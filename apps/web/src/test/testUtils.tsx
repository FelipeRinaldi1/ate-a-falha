import type { ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
	initialEntries?: string[]
}

export function renderWithProviders(ui: ReactNode, { initialEntries = ['/'], ...options }: CustomRenderOptions = {}) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	})

	function Wrapper({ children }: { children: ReactNode }) {
		return (
			<QueryClientProvider client={queryClient}>
				<MantineProvider>
					<ModalsProvider>
						<MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
					</ModalsProvider>
				</MantineProvider>
			</QueryClientProvider>
		)
	}

	return {
		queryClient,
		...render(ui, { wrapper: Wrapper, ...options }),
	}
}
