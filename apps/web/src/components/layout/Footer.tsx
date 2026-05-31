import { AppShell, Group, Stack, Text, UnstyledButton } from '@mantine/core'
import { Apple, Dumbbell, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Footer() {
	const navigate = useNavigate()

	return (
		<AppShell.Footer hiddenFrom="sm">
			<Group grow h="100%" gap={0}>
				<UnstyledButton h="100%" onClick={() => navigate('/')}>
					<Stack h="100%" justify="center" align="center" gap={4}>
						<Dumbbell size="24" />
						<Text size="xs" lh={1}>
							Treino
						</Text>
					</Stack>
				</UnstyledButton>
				<UnstyledButton h="100%" onClick={() => navigate('/profile')}>
					<Stack h="100%" justify="center" align="center" gap={4}>
						<User size="24" />
						<Text size="xs" lh={1}>
							Perfil
						</Text>
					</Stack>
				</UnstyledButton>
				<UnstyledButton h="100%" onClick={() => navigate('/nutrition/create-food')}>
					<Stack h="100%" justify="center" align="center" gap={4}>
						<Apple size="24" />
						<Text size="xs" lh={1}>
							Dieta
						</Text>
					</Stack>
				</UnstyledButton>
			</Group>
		</AppShell.Footer>
	)
}
