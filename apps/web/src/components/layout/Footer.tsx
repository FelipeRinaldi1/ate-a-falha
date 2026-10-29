import { AppShell, Group, Stack, Text, UnstyledButton } from '@mantine/core'
import { Apple, Dumbbell, User } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export function Footer() {
	const navigate = useNavigate()
	const location = useLocation()

	const handleNavigate = (path: string) => {
		if (location.pathname !== path) {
			navigate(path)
		}
	}

	return (
		<AppShell.Footer hiddenFrom="sm">
			<Group grow h="100%" gap={0}>
				<UnstyledButton h="100%" onClick={() => handleNavigate('/workout')}>
					<Stack h="100%" justify="center" align="center" gap={4}>
						<Dumbbell size="24" />
						<Text size="xs" lh={1}>
							Treino
						</Text>
					</Stack>
				</UnstyledButton>
				<UnstyledButton h="100%" onClick={() => handleNavigate('/profile')}>
					<Stack h="100%" justify="center" align="center" gap={4}>
						<User size="24" />
						<Text size="xs" lh={1}>
							Perfil
						</Text>
					</Stack>
				</UnstyledButton>
				<UnstyledButton h="100%" onClick={() => handleNavigate('/nutrition')}>
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
