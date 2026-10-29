import { Stack, Text, Button } from '@mantine/core'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/user/hooks/useAuth'

export function DesktopNavbar() {
	const navigate = useNavigate()
	const location = useLocation()
	const { logout } = useAuth()

	const handleNavigate = (path: string) => {
		if (location.pathname !== path) {
			navigate(path)
		}
	}

	return (
		<Stack p="md" visibleFrom="sm" h="100%">
			<Text size="sm" c="dimmed" fw={500}>
				Navegação
			</Text>
			<Button
				variant={location.pathname.startsWith('/workout') ? 'light' : 'subtle'}
				justify="left"
				onClick={() => handleNavigate('/workout')}
			>
				Treino
			</Button>
			<Button
				variant={location.pathname.startsWith('/profile') ? 'light' : 'subtle'}
				justify="left"
				onClick={() => handleNavigate('/profile')}
			>
				Perfil
			</Button>
			<Button
				variant={location.pathname.startsWith('/nutrition') ? 'light' : 'subtle'}
				justify="left"
				onClick={() => handleNavigate('/nutrition')}
			>
				Dieta
			</Button>

			<Stack mt="auto">
				<Button variant="subtle" justify="left" color="red" onClick={logout}>
					Sair
				</Button>
			</Stack>
		</Stack>
	)
}
