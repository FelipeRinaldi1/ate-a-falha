import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button, Paper, Text, Group } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/charts/styles.css'

export function App() {
	const {
		needRefresh: [needRefresh, setNeedRefresh],
		updateServiceWorker,
	} = useRegisterSW()

	return (
		<>
			<RouterProvider router={router} />


			{needRefresh && (
				<Paper
					withBorder
					p="md"
					radius="md"
					style={{
						position: 'fixed',
						bottom: 20,
						right: 20,
						zIndex: 9999,
						boxShadow: 'var(--mantine-shadow-md)',
						backgroundColor: 'var(--mantine-color-dark-6)',
					}}
				>
					<Group gap="md">
						<Text size="sm" fw={600}>Nova versão disponível!</Text>
						<Button size="xs" color="blue" onClick={() => updateServiceWorker(true)}>
							Atualizar
						</Button>
						<Button size="xs" variant="subtle" color="gray" onClick={() => setNeedRefresh(false)}>
							Fechar
						</Button>
					</Group>
				</Paper>
			)}
		</>
	)
}
