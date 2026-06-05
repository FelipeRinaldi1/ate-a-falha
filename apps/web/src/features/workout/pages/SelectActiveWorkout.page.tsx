import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Container, Stack, Text, Button, Center, Loader, Paper, Group } from '@mantine/core'
import { Dumbbell } from 'lucide-react'
import { MainLayout } from '../../../components/layout/MainLayout'
import { api } from '../../../api/axiosInstance'
import { type PlanDTO, type WorkoutDTO } from '@ate-a-falha/shared'

export function SelectActiveWorkoutPage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()

	const { data: plan, isLoading } = useQuery<PlanDTO>({
		queryKey: ['workout-plans-detail', id],
		queryFn: async () => {
			const res = await api.get(`/workout/plans/${id}`)
			return res.data
		},
		enabled: !!id,
	})

	const workouts = plan?.workouts || []

	const sortedWorkouts = [...workouts].sort((a: WorkoutDTO, b: WorkoutDTO) => a.day.localeCompare(b.day))

	const handleStartWorkout = (workout: WorkoutDTO) => {
		navigate(`/workout/active/${id}?workoutId=${workout.id}`)
	}

	if (isLoading) {
		return (
			<MainLayout title="Iniciar Treino" onBack={() => navigate(-1)}>
				<Center style={{ height: '70vh' }}>
					<Loader size="lg" />
				</Center>
			</MainLayout>
		)
	}

	return (
		<MainLayout title="Iniciar Treino" onBack={() => navigate(-1)}>
			<Container size="xs" px={0}>
				<Stack gap="xl" align="center" pt="xl" pb="xl">
					{/* Plan Selector Header */}
					<Center style={{ width: '100%' }}>
						<Text fw={700} size="md" c="dimmed" style={{ textAlign: 'center' }}>
							{plan?.name || 'Sem Ficha'}
						</Text>
					</Center>

					{/* Question */}
					<Stack gap={4} align="center">
						<Text fw={800} size="lg" style={{ textAlign: 'center' }}>
							Qual treino você irá realizar?
						</Text>
						<Text size="xs" c="dimmed">
							Selecione uma das divisões da sua ficha ativa
						</Text>
					</Stack>

					{/* Workout Buttons A-F */}
					<Stack gap="sm" style={{ width: '100%' }}>
						{sortedWorkouts.length > 0 ? (
							sortedWorkouts.map((w: WorkoutDTO) => (
								<Button
									key={w.id}
									size="xl"
									radius="md"
									variant="filled"
									color="dark.6"
									onClick={() => handleStartWorkout(w)}
									styles={{
										inner: {
											justifyContent: 'center',
										},
									}}
									style={{
										border: '1px solid var(--mantine-color-dark-4)',
										transition: 'all 0.2s ease',
										height: '64px',
										fontWeight: 800,
										fontSize: '18px',
									}}
								>
									<Group justify="center" gap="md">
										<Text fw={900} size="xl" c="blue.4">
											{w.day}
										</Text>
										{w.name && (
											<Text fw={600} size="sm" c="dimmed">
												({w.name})
											</Text>
										)}
									</Group>
								</Button>
							))
						) : (
							<Paper withBorder p="xl" radius="md" style={{ textAlign: 'center', width: '100%' }}>
								<Stack gap="xs" align="center">
									<Dumbbell size={32} color="gray" />
									<Text size="sm" c="dimmed">
										Nenhum treino ativo cadastrado nesta ficha.
									</Text>
								</Stack>
							</Paper>
						)}
					</Stack>
				</Stack>
			</Container>
		</MainLayout>
	)
}
