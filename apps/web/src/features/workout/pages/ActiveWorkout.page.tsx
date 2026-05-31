import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
	Container,
	Stack,
	Text,
	Button,
	Center,
	Loader,
	Paper,
	Group,
	Card,
	Image,
} from '@mantine/core'
import { MainLayout } from '../../../components/layout/MainLayout'
import { api } from '../../../api/axiosInstance'
import { type PlanDTO, type WorkoutDTO } from '@ate-a-falha/shared'
import { notifications } from '@mantine/notifications'

export function ActiveWorkoutPage() {
	const { id } = useParams<{ id: string }>()
	const [searchParams] = useSearchParams()
	const workoutId = searchParams.get('workoutId')
	const navigate = useNavigate()

	// Fetch Plan details
	const { data: plan, isLoading } = useQuery<PlanDTO>({
		queryKey: ['workout-plans-detail', id],
		queryFn: async () => {
			const res = await api.get(`/workout/plans/${id}`)
			return res.data
		},
		enabled: !!id,
	})

	const workouts = plan?.workouts || []
	const activeWorkout = workouts.find((w: WorkoutDTO) => w.id === workoutId) || workouts[0]

	const handleFinishWorkout = () => {
		notifications.show({
			title: 'Treino Concluído! 🎉',
			message: 'Parabéns por finalizar mais um treino. Continue focado!',
			color: 'green',
		})
		navigate('/workout')
	}

	const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1'

	if (isLoading) {
		return (
			<MainLayout title="Treino em Andamento" onBack={() => navigate(-1)}>
				<Center style={{ height: '70vh' }}>
					<Loader size="lg" />
				</Center>
			</MainLayout>
		)
	}

	return (
		<MainLayout title="Treino em Andamento" onBack={() => navigate(-1)}>
			<Container size="xs" px={0}>
				<Stack gap="md" pb="xl">
					{/* Workout Header */}
					{activeWorkout ? (
						<Paper withBorder p="md" radius="md" bg="var(--mantine-color-dark-7)">
							<Stack gap="xs">
								<Text size="xs" c="blue" fw={800}>
									EXECUÇÃO DE TREINO
								</Text>
								<Text fw={800} size="xl">
									Treino {activeWorkout.day} - {activeWorkout.name || 'Sem Foco'}
								</Text>
								<Text size="xs" c="dimmed">
									Ficha: {plan?.name}
								</Text>
							</Stack>
						</Paper>
					) : (
						<Paper withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
							<Text size="sm" c="dimmed">
								Nenhum treino selecionado.
							</Text>
						</Paper>
					)}

					{/* Exercises List */}
					<Stack gap="sm">
						{activeWorkout?.exercises && activeWorkout.exercises.length > 0 ? (
							activeWorkout.exercises.map((we: any) => {
								const imagePath = we.exercise?.images?.[0]
								const exerciseImageUrl = imagePath
									? `${apiBaseUrl}/assets/exercises/${imagePath.endsWith('.webp') ? imagePath : imagePath.replace(/\.[^/.]+$/, '.webp')}`
									: 'https://placehold.co/60x60?text=Exercício'

								return (
									<Card key={we.id} withBorder p="md" radius="md" style={{ backgroundColor: 'var(--mantine-color-dark-6)' }}>
										<Group gap="md" wrap="nowrap" align="center">
											<div style={{ width: '60px', height: '60px', flexShrink: 0, overflow: 'hidden', borderRadius: '6px' }}>
												<Image
													src={exerciseImageUrl}
													w={60}
													h={60}
													fit="cover"
													fallbackSrc="https://placehold.co/60x60?text=Exercício"
												/>
											</div>
											<Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
												<Text fw={700} size="sm" truncate>
													{we.exercise?.name}
												</Text>
												<Stack gap={2}>
													{we.set?.map((s: any) => (
														<Text key={s.id} size="11px" c="dimmed">
															Série {s.setNumber}: {s.repetitions} reps {s.weight ? `x ${s.weight} Kg` : ''} ({s.restTimeSeconds}s desc.)
														</Text>
													))}
												</Stack>
											</Stack>
										</Group>
									</Card>
								)
							})
						) : (
							<Paper withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
								<Text size="xs" c="dimmed">
									Nenhum exercício agendado para este treino.
								</Text>
							</Paper>
						)}
					</Stack>

					{/* Finish Button */}
					{activeWorkout && (
						<Button
							size="lg"
							radius="xl"
							color="green"
							fullWidth
							mt="lg"
							onClick={handleFinishWorkout}
							style={{
								boxShadow: '0 8px 24px rgba(40, 167, 69, 0.3)',
								fontWeight: 800,
							}}
						>
							Finalizar Treino
						</Button>
					)}
				</Stack>
			</Container>
		</MainLayout>
	)
}
