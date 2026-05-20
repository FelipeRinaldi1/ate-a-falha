import { Stack, Text, Button } from '@mantine/core'

export function MobileNavbar() {
	return (
		<Stack p="md" hiddenFrom="sm" h="100%">
			<Text size="sm" c="dimmed" fw={500}>
				Configurações
			</Text>
			<Button variant="subtle" justify="left">
				Minha Conta
			</Button>
			<Button variant="subtle" justify="left">
				Notificações
			</Button>

			<Stack mt="auto">
				<Button variant="subtle" justify="left" color="red">
					Sair
				</Button>
			</Stack>
		</Stack>
	)
}
