import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Container, Paper, Stack, Text, Title, Button, Center, Loader, Card, Badge, Group, List, Alert, Divider } from '@mantine/core'
import { ArrowLeft, Download, Info } from 'lucide-react'
import { api } from '../api/axiosInstance'
import { useAuth } from '../features/user/hooks/useAuth'

const GOAL_LABELS: Record<string, string> = {
	forca: 'Força',
	hipertrofia: 'Hipertrofia',
	resistencia: 'Resistência Muscular',
}

export function ShareWorkoutPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { isAuthenticated } = useAuth()

	const { data: plan, isLoading, isError } = useQuery({
		queryKey: ['share-workout', id],
		queryFn: async () => {
			const res = await api.get(`/workout/plans/${id}/export`)
			return res.data
		},
		retry: false,
	})

	const importMutation = useMutation({
		mutationFn: async () => {
			const res = await api.post(`/workout/plans/${id}/import`)
			return res.data
		},
		onSuccess: () => {
			navigate('/workout/plans')
		},
	})

	if (isLoading) {
		return (
			<Center style={{ height: '100vh', flexDirection: 'column', gap: '16px' }}>
				<Loader size="lg" />
				<Text c="dimmed">Carregando treino público...</Text>
			</Center>
		)
	}

	if (isError || !plan) {
		return (
			<Container size="xs" py="xl">
				<Stack gap="lg" align="center" style={{ minHeight: '80vh', justifyContent: 'center' }}>
					<Alert color="red" title="Treino Indisponível" icon={<Info size={16} />}>
						Este link de compartilhamento de treino é inválido ou o criador desativou o compartilhamento público.
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
					<Button variant="subtle" leftSection={<ArrowLeft size={16} />} onClick={() => navigate('/')}>
						Voltar
					</Button>
					<Badge color="blue" size="lg" variant="light">
						Treino Compartilhado
					</Badge>
				</Group>

				<Paper withBorder p="xl" radius="md" shadow="md" style={{ position: 'relative' }}>
					<Stack gap="md">
						<Stack gap={4}>
							<Title order={2}>{plan.name}</Title>
							<Text size="sm" c="dimmed" fw={600}>
								Foco: {GOAL_LABELS[plan.goal] || 'Hipertrofia'}
							</Text>
						</Stack>

						<Divider />

						<Title order={4} c="dimmed">Rotina de Treinos</Title>

						<Stack gap="md">
							{plan.workouts && plan.workouts.length > 0 ? (
								plan.workouts.map((w: any) => (
									<Card key={w.id} withBorder p="md" radius="sm" bg="var(--mantine-color-dark-8)">
										<Stack gap="xs">
											<Group justify="space-between">
												<Text fw={700} size="md">{w.name}</Text>
												<Badge color="gray">{w.day}</Badge>
											</Group>

											<List spacing="xs" size="sm" center>
												{w.workoutExercises && w.workoutExercises.length > 0 ? (
													w.workoutExercises.map((we: any) => (
														<List.Item key={we.id}>
															<Text size="sm" fw={600} style={{ display: 'inline' }}>
																{we.exercise.name}
															</Text>
															<Text size="xs" c="dimmed" style={{ display: 'inline', marginLeft: '6px' }}>
																({we.sets ? we.sets.length : 0} séries)
															</Text>
														</List.Item>
													))
												) : (
													<Text size="xs" c="dimmed">Nenhum exercício cadastrado.</Text>
												)}
											</List>
										</Stack>
									</Card>
								))
							) : (
								<Text size="sm" c="dimmed">Nenhum treino cadastrado neste plano.</Text>
							)}
						</Stack>

						<Button
							leftSection={<Download size={18} />}
							size="lg"
							color="blue"
							fullWidth
							mt="lg"
							loading={importMutation.isPending}
							onClick={() => {
								if (!isAuthenticated) {
									navigate(`/login?redirect=/share/workout/${id}`)
								} else {
									importMutation.mutate()
								}
							}}
						>
							{isAuthenticated ? 'Importar Treino para Minha Conta' : 'Conectar para Importar'}
						</Button>
					</Stack>
				</Paper>
			</Stack>
		</Container>
	)
}
