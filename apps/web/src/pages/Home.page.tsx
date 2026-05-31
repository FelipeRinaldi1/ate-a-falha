import { Container, Stack, Title, Text, Card, Image, Badge, Group } from '@mantine/core'
import { MainLayout } from '../components/layout/MainLayout.js'

export function HomePage() {
	const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1'
	const imageUrl = `${apiBaseUrl}/assets/exercises/Barbell_Curl/0.webp`

	return (
		<MainLayout title="Treino">
			<Container size="xs" px={0}>
				<Stack gap="md">
					<Title order={3} fw={700} c="dimmed">
						Exercício em Destaque
					</Title>

					<Card withBorder p="md" radius="md" shadow="sm">
						<Card.Section>
							<Image
								src={imageUrl}
								height={260}
								alt="Rosca Direta com Barra"
								fallbackSrc="https://placehold.co/600x400?text=Barbell+Curl"
								fit="contain"
								style={{ backgroundColor: 'var(--mantine-color-dark-8)' }}
							/>
						</Card.Section>

						<Stack mt="md" gap="xs">
							<Group justify="space-between">
								<Text fw={700} size="lg">
									Rosca Direta com Barra (Barbell Curl)
								</Text>
								<Badge color="red.6" variant="light">
									Bíceps
								</Badge>
							</Group>

							<Text size="sm" c="dimmed">
								A rosca direta com barra é um dos exercícios fundamentais e mais eficazes para isolar e desenvolver a massa muscular da região dos bíceps.
							</Text>

							<Group gap="xs" mt="xs">
								<Badge variant="outline" color="blue">Força</Badge>
								<Badge variant="outline" color="gray">Equipamento: Barra</Badge>
							</Group>
						</Stack>
					</Card>
				</Stack>
			</Container>
		</MainLayout>
	)
}
