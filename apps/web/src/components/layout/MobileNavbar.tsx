import { Stack, Text, Button } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/user/hooks/useAuth'

export function MobileNavbar() {
	const navigate = useNavigate()
	const { logout } = useAuth()

	return (
		<Stack p="md" hiddenFrom="sm" h="100%">
			<Text size="sm" c="dimmed" fw={500}>
				Configurações
			</Text>
			<Button variant="subtle" justify="left" onClick={() => navigate('/profile')}>
				Minha Conta
			</Button>
			<Button variant="subtle" justify="left" onClick={() => navigate('/workout')}>
				Treinos
			</Button>
			<Button variant="subtle" justify="left" onClick={() => navigate('/nutrition')}>
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
