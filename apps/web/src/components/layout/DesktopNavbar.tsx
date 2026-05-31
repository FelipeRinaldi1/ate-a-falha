import { Stack, Text, Button } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/user/hooks/useAuth'

export function DesktopNavbar() {
	const navigate = useNavigate()
	const { logout } = useAuth()

	return (
		<Stack p="md" visibleFrom="sm" h="100%">
			<Text size="sm" c="dimmed" fw={500}>
				Navegação
			</Text>
			<Button variant="subtle" justify="left" onClick={() => navigate('/workout')}>
				Treino
			</Button>
			<Button variant="subtle" justify="left" onClick={() => navigate('/profile')}>
				Perfil
			</Button>
			<Button variant="subtle" justify="left" onClick={() => navigate('/nutrition')}>
				Dieta
			</Button>

			<Stack mt="auto">
				<Text size="sm" c="dimmed" fw={500}>
					Outros
				</Text>
				<Button variant="subtle" justify="left">
					Configurações
				</Button>
				<Button variant="subtle" justify="left" color="red" onClick={logout}>
					Sair
				</Button>
			</Stack>
		</Stack>
	)
}
