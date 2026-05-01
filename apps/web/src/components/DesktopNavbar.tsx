import { Stack, Text, Button } from '@mantine/core'

export function DesktopNavbar() {
	return (
		<Stack p="md" visibleFrom="sm" h="100%">
			<Text size="sm" c="dimmed" fw={500}>
				Navegação
			</Text>
			<Button variant="subtle" justify="left">
				Treino
			</Button>
			<Button variant="subtle" justify="left">
				Perfil
			</Button>
			<Button variant="subtle" justify="left">
				Dieta
			</Button>

			<Stack mt="auto">
				<Text size="sm" c="dimmed" fw={500}>
					Outros
				</Text>
				<Button variant="subtle" justify="left">
					Configurações
				</Button>
				<Button variant="subtle" justify="left" color="red">
					Sair
				</Button>
			</Stack>
		</Stack>
	)
}
