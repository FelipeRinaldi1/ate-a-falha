import { AppShell, Burger, Group, Text, Button, Stack, Container } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

export default function App() {
	// Controle do menu lateral no mobile
	const [opened, { toggle }] = useDisclosure()

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 300,
				breakpoint: 'sm',
				collapsed: { mobile: !opened },
			}}
			padding="md"
		>
			{/* --- CABEÇALHO --- */}
			<AppShell.Header>
				<Group h="100%" px="md" justify="space-between">
					<Group>
						<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
						<Text size="xl" fw={900} variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
							GYM-NUTRITION
						</Text>
					</Group>
					<Button variant="light" color="red" size="xs">
						Sair
					</Button>
				</Group>
			</AppShell.Header>

			{/* --- MENU LATERAL --- */}
			<AppShell.Navbar p="md">
				<Stack gap="sm">
					<Button variant="light" justify="flex-start">
						Painel Geral
					</Button>
					<Button variant="subtle" color="gray" justify="flex-start">
						Meus Treinos
					</Button>
					<Button variant="subtle" color="gray" justify="flex-start">
						Minha Dieta
					</Button>
					<Button variant="subtle" color="gray" justify="flex-start">
						Falar com Nutri
					</Button>
				</Stack>
			</AppShell.Navbar>

			{/* --- CONTEÚDO PRINCIPAL --- */}
			<AppShell.Main bg="gray.0">
				<Container size="lg">
					<Title order={2} mb="xl">
						Olá, Felipe! 👋
					</Title>

					<SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
						{/* CARD DE TREINO */}
						<Card shadow="sm" padding="lg" radius="md" withBorder>
							<Group justify="space-between" mb="xs">
								<Text fw={700}>Próximo Treino</Text>
								<Badge color="orange">Treino B</Badge>
							</Group>
							<Text size="sm" c="dimmed" mb="lg">
								Costas e Bíceps - Foco em remadas pesadas.
							</Text>
							<Button fullWidth color="blue" radius="md">
								Iniciar Treino
							</Button>
						</Card>

						{/* CARD DE DIETA */}
						<Card shadow="sm" padding="lg" radius="md" withBorder>
							<Text fw={700} mb="xs">
								Resumo Nutricional
							</Text>
							<Stack gap="xs">
								<Group justify="space-between">
									<Text size="sm">Proteína</Text>
									<Text size="sm" fw={700}>
										180g / 200g
									</Text>
								</Group>
								{/* Aqui entraria um RingProgress do Mantine depois */}
								<Text size="xs" c="dimmed">
									Faltam 20g para bater a meta!
								</Text>
							</Stack>
							<Button fullWidth variant="outline" mt="md" radius="md">
								Ver Dieta Completa
							</Button>
						</Card>

						{/* CARD DE PROFISSIONAL */}
						<Card shadow="sm" padding="lg" radius="md" withBorder>
							<Text fw={700} mb="xs">
								Seu Nutricionista
							</Text>
							<Group mt="sm">
								<Skeleton height={40} circle /> {/* Simula foto do nutri */}
								<div>
									<Text size="sm" fw={500}>
										Dr. Ricardo Silva
									</Text>
									<Text size="xs" c="dimmed">
										Próxima consulta: 25/05
									</Text>
								</div>
							</Group>
							<Button fullWidth variant="subtle" mt="md">
								Enviar Mensagem
							</Button>
						</Card>
					</SimpleGrid>
				</Container>
			</AppShell.Main>
		</AppShell>
	)
}
