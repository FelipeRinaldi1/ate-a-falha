import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Container, Paper, Stack, Text, Title, Button, Center, Loader, Card, Badge, Group, List, Alert, Divider, SimpleGrid } from '@mantine/core'
import { ArrowLeft, Download, Info } from 'lucide-react'
import { api } from '../../../api/axiosInstance'
import { useAuth } from '../../user/hooks/useAuth'
import { type MealDTO, type FoodInMealDTO } from '@ate-a-falha/shared'

export function ShareDietPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { isAuthenticated } = useAuth()

	const { data: diet, isLoading, isError } = useQuery({
		queryKey: ['share-diet', id],
		queryFn: async () => {
			const res = await api.get(`/nutrition/diets/${id}/export`)
			return res.data
		},
		retry: false,
	})

	const importMutation = useMutation({
		mutationFn: async () => {
			const res = await api.post(`/nutrition/diets/${id}/import`)
			return res.data
		},
		onSuccess: () => {
			navigate('/nutrition/goals')
		},
	})

	if (isLoading) {
		return (
			<Center style={{ height: '100vh', flexDirection: 'column', gap: '16px' }}>
				<Loader size="lg" />
				<Text c="dimmed">Carregando dieta pública...</Text>
			</Center>
		)
	}

	if (isError || !diet) {
		return (
			<Container size="xs" py="xl">
				<Stack gap="lg" align="center" style={{ minHeight: '80vh', justifyContent: 'center' }}>
					<Alert color="red" title="Dieta Indisponível" icon={<Info size={16} />}>
						Este link de compartilhamento de dieta é inválido ou o criador desativou o compartilhamento público.
					</Alert>
					<Button variant="subtle" leftSection={<ArrowLeft size={16} />} onClick={() => navigate('/login')}>
						Voltar para a Tela Inicial
					</Button>
				</Stack>
			</Container>
		)
	}

	return (
		<Container size="xs" py="xl">
			<Stack gap="lg">
				<Group justify="space-between" align="center">
					<Button variant="subtle" leftSection={<ArrowLeft size={16} />} onClick={() => navigate('/nutrition')}>
						Voltar
					</Button>
					<Badge color="green" size="lg" variant="light">
						Dieta Compartilhada
					</Badge>
				</Group>

				<Paper withBorder p="xl" radius="md" shadow="md" style={{ position: 'relative' }}>
					<Stack gap="md">
						<Stack gap={4}>
							<Title order={2}>{diet.name}</Title>
							<Text size="sm" c="dimmed">
								Meta diária estimada: <strong>{diet.dailyKcalGoal} Kcal</strong>
							</Text>
						</Stack>

						<Divider />

						<Title order={4} c="dimmed">Metas de Macronutrientes</Title>

						<SimpleGrid cols={2} spacing="xs">
							<Card withBorder p="xs" radius="sm" style={{ textAlign: 'center' }}>
								<Text size="xs" fw={700} c="red">Proteínas</Text>
								<Text size="sm" fw={700}>{diet.dailyProteinGoal}g</Text>
							</Card>
							<Card withBorder p="xs" radius="sm" style={{ textAlign: 'center' }}>
								<Text size="xs" fw={700} c="yellow">Carboidratos</Text>
								<Text size="sm" fw={700}>{diet.dailyCarbGoal}g</Text>
							</Card>
							<Card withBorder p="xs" radius="sm" style={{ textAlign: 'center' }}>
								<Text size="xs" fw={700} c="green">Gorduras</Text>
								<Text size="sm" fw={700}>{diet.dailyFatGoal}g</Text>
							</Card>
							<Card withBorder p="xs" radius="sm" style={{ textAlign: 'center' }}>
								<Text size="xs" fw={700} c="blue">Água</Text>
								<Text size="sm" fw={700}>{(diet.dailyWaterGoal / 1000).toFixed(1)}L</Text>
							</Card>
						</SimpleGrid>

						<Divider />

						<Title order={4} c="dimmed">Refeições Planejadas</Title>

						<Stack gap="md">
							{diet.meals && diet.meals.length > 0 ? (
								diet.meals.map((m: MealDTO) => (
									<Card key={m.id} withBorder p="md" radius="sm" bg="var(--mantine-color-dark-8)">
										<Stack gap="xs">
											<Group justify="space-between">
												<Text fw={700} size="sm">{m.name}</Text>
												<Badge color="gray">{m.time}</Badge>
											</Group>

											<List spacing="xs" size="xs">
												{m.foods && m.foods.length > 0 ? (
													m.foods.map((f: FoodInMealDTO) => (
														<List.Item key={f.id}>
															<Text size="xs" fw={600} style={{ display: 'inline' }}>
																{f.food.name}
															</Text>
															<Text size="xs" c="dimmed" style={{ display: 'inline', marginLeft: '6px' }}>
																({f.quantity}g)
															</Text>
														</List.Item>
													))
												) : (
													<Text size="xs" c="dimmed">Nenhum alimento cadastrado.</Text>
												)}
											</List>
										</Stack>
									</Card>
								))
							) : (
								<Text size="sm" c="dimmed">Nenhuma refeição cadastrada nesta dieta.</Text>
							)}
						</Stack>

						<Button
							leftSection={<Download size={18} />}
							size="lg"
							color="green"
							fullWidth
							mt="lg"
							loading={importMutation.isPending}
							onClick={() => {
								if (!isAuthenticated) {
									navigate(`/login?redirect=/share/diet/${id}`)
								} else {
									importMutation.mutate()
								}
							}}
						>
							{isAuthenticated ? 'Importar Dieta para Minha Conta' : 'Conectar para Importar'}
						</Button>
					</Stack>
				</Paper>
			</Stack>
		</Container>
	)
}
