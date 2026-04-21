import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { MantineProvider } from '@mantine/core'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './providers/queryClient'
import { AuthProvider } from './providers/AuthProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<MantineProvider defaultColorScheme="dark">
				<AuthProvider>
					<App />
				</AuthProvider>
			</MantineProvider>
		</QueryClientProvider>
	</React.StrictMode>
)
