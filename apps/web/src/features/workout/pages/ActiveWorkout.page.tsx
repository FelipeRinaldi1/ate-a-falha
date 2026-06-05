import { useState, useEffect } from 'react'
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
	Image,
	Checkbox,
	Divider,
} from '@mantine/core'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { MainLayout } from '../../../components/layout/MainLayout'
import { api } from '../../../api/axiosInstance'
import { type PlanDTO, type WorkoutDTO, type WorkoutExerciseDTO } from '@ate-a-falha/shared'
import { notifications } from '@mantine/notifications'

export function ActiveWorkoutPage() {
	const { id } = useParams<{ id: string }>()
	const [searchParams] = useSearchParams()
	const workoutId = searchParams.get('workoutId')
	const navigate = useNavigate()

	// State for which exercise cards are expanded (key: workoutExerciseId, value: boolean)
	const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>(() => {
		if (!workoutId) return {}
		try {
			const saved = localStorage.getItem(`ate-a-falha:active-workout:${workoutId}:expanded`)
			return saved ? JSON.parse(saved) : {}
		} catch {
			return {}
		}
	})
	// State for checked sets/timers (key: set.id or exerciseId-timer, value: boolean)
	const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
		if (!workoutId) return {}
		try {
			const saved = localStorage.getItem(`ate-a-falha:active-workout:${workoutId}:checked`)
			return saved ? JSON.parse(saved) : {}
		} catch {
			return {}
		}
	})

	// Persist states to localStorage
	useEffect(() => {
		if (workoutId) {
			localStorage.setItem(`ate-a-falha:active-workout:${workoutId}:expanded`, JSON.stringify(expandedExercises))
		}
	}, [expandedExercises, workoutId])

	useEffect(() => {
		if (workoutId) {
			localStorage.setItem(`ate-a-falha:active-workout:${workoutId}:checked`, JSON.stringify(checkedItems))
		}
	}, [checkedItems, workoutId])

	// Fetch Plan details
	const { data: plan, isLoading } = useQuery<PlanDTO>({
		queryKey: ['workout-plans-detail', id],
		queryFn: async () => {
			const res = await api.get(`/workout/plans/${id}`)
			return res.data
		},
		enabled: !!id,
		refetchOnWindowFocus: false,
	})

	const workouts = plan?.workouts || []
	const activeWorkout = workouts.find((w: WorkoutDTO) => w.id === workoutId) || workouts[0]

	const handleFinishWorkout = () => {
		if (workoutId) {
			localStorage.removeItem(`ate-a-falha:active-workout:${workoutId}:expanded`)
			localStorage.removeItem(`ate-a-falha:active-workout:${workoutId}:checked`)
		}
		notifications.show({
			title: 'Treino Concluído! 🎉',
			message: 'Parabéns por finalizar mais um treino. Continue focado!',
			color: 'green',
		})
		navigate('/workout')
	}

	const toggleExpand = (weId: string) => {
		setExpandedExercises((prev) => ({ ...prev, [weId]: !prev[weId] }))
	}

	const toggleCheck = (itemId: string) => {
		setCheckedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }))
	}

	const toggleAllSets = (we: WorkoutExerciseDTO, e?: React.MouseEvent | React.ChangeEvent) => {
		if (e && 'stopPropagation' in e) {
			e.stopPropagation()
		}
		const sets = we.sets || []
		if (sets.length === 0) return
		
		const allChecked = sets.every((s) => !!checkedItems[s.id])
		const newChecked = { ...checkedItems }
		sets.forEach((s) => {
			newChecked[s.id] = !allChecked
		})
		setCheckedItems(newChecked)
	}

	const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1'

	if (isLoading) {
		return (
			<MainLayout title="Ficha - Exercícios" onBack={() => navigate(-1)}>
				<Center style={{ height: '70vh' }}>
					<Loader size="lg" />
				</Center>
			</MainLayout>
		)
	}

	return (
		<MainLayout title={`${plan?.name || 'Ficha'} - Exercícios`} onBack={() => navigate(-1)}>
			<Container size="xs" px={0}>
				<Stack gap="md" pb={100} pt="md">
					{/* Active Workout Info Header */}
					{activeWorkout && (
						<Text fw={700} size="sm" c="dimmed" style={{ textAlign: 'center' }}>
							&lt; Treino {activeWorkout.day} - {activeWorkout.name || 'Sem Foco'} &gt;
						</Text>
					)}

					{/* Exercises List mimicking the mockup */}
					<Stack gap="md">
						{activeWorkout?.workoutExercises && activeWorkout.workoutExercises.length > 0 ? (
							activeWorkout.workoutExercises.map((we: WorkoutExerciseDTO) => {
								const weId = we.id
								const isExpanded = !!expandedExercises[weId]
								const imagePath = we.exercise?.images?.[0]
								const exerciseImageUrl = imagePath
									? `${apiBaseUrl}/assets/exercises/${imagePath.endsWith('.webp') ? imagePath : imagePath.replace(/\.[^/.]+$/, '.webp')}`
									: 'https://placehold.co/80x80?text=Exercício'

								const totalSets = we.sets?.length || 0
								const restTimeMin = we.sets?.[0]
									? (we.sets[0].restTimeSeconds / 60).toFixed(0)
									: '1'
								const isExerciseCompleted = we.sets && we.sets.length > 0 && we.sets.every((s: any) => !!checkedItems[s.id])

								return (
									<Paper
										key={weId}
										withBorder
										radius="md"
										style={{
											overflow: 'hidden',
											backgroundColor: isExerciseCompleted ? 'rgba(40, 167, 69, 0.1)' : 'var(--mantine-color-dark-6)',
											borderColor: isExerciseCompleted ? 'var(--mantine-color-green-7)' : 'var(--mantine-color-dark-4)',
											transition: 'background-color 0.2s ease, border-color 0.2s ease',
										}}
									>
										<Stack gap={0}>
											{/* Top portion: Info row clickable for toggle */}
											<Group
												gap="md"
												p="md"
												align="center"
												wrap="nowrap"
												style={{ cursor: 'pointer' }}
												onClick={() => toggleExpand(weId)}
											>
												<Checkbox
													checked={isExerciseCompleted}
													onChange={(e) => toggleAllSets(we, e)}
													onClick={(e) => e.stopPropagation()}
													radius="xl"
													color="green"
													size="md"
													styles={{ input: { cursor: 'pointer' } }}
												/>
												<div style={{ width: '60px', height: '60px', flexShrink: 0, overflow: 'hidden', borderRadius: '8px', backgroundColor: 'var(--mantine-color-dark-8)' }}>
													<Image
														src={exerciseImageUrl}
														w={60}
														h={60}
														fit="cover"
														fallbackSrc="https://placehold.co/60x60?text=Exercício"
													/>
												</div>
												<Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
													<Text fw={800} size="md" style={{ lineHeight: 1.2 }}>
														{we.exercise?.name}
													</Text>
													<Group gap="xs" style={{ flexWrap: 'nowrap' }}>
														<Text size="xs" c="dimmed" fw={600}>
															{totalSets} séries
														</Text>
														<Text size="xs" c="dimmed">•</Text>
														<Text size="xs" c="dimmed" fw={600}>
															{restTimeMin} min desc
														</Text>
													</Group>
												</Stack>
												<div style={{ color: 'var(--mantine-color-dark-2)', display: 'flex', alignItems: 'center' }}>
													{isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
												</div>
											</Group>

											{/* Expanded items section */}
											{isExpanded && (
												<Stack gap="xs" px="md" pb="md">
													<Divider color="dark.4" />
													
													{/* Sets Table Header */}
													<Group justify="space-between" px="xs" py={4} style={{ color: 'var(--mantine-color-gray-5)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
														<Group gap="md" style={{ flex: 1 }} wrap="nowrap">
															<Text size="11px" fw={700} style={{ width: '40px', textAlign: 'center' }}>Série</Text>
															<Text size="11px" fw={700} style={{ width: '70px', textAlign: 'center' }}>Repetições</Text>
															<Text size="11px" fw={700} style={{ width: '60px', textAlign: 'center' }}>Carga</Text>
														</Group>
														<Text size="11px" fw={700} style={{ width: '40px', textAlign: 'center' }}>Feito</Text>
													</Group>

													{/* Sets Grid */}
													{we.sets?.map((s: any, idx: number) => {
														const setId = s.id
														const isChecked = !!checkedItems[setId]
														return (
															<Paper
																key={setId}
																p="xs"
																radius="sm"
																style={{
																	backgroundColor: isChecked ? 'var(--mantine-color-dark-8)' : 'var(--mantine-color-dark-7)',
																	border: '1px solid var(--mantine-color-dark-5)',
																	cursor: 'pointer',
																	opacity: isChecked ? 0.6 : 1,
																	transition: 'all 0.15s ease',
																}}
																onClick={() => toggleCheck(setId)}
															>
																<Group justify="space-between" wrap="nowrap">
																	<Group gap="md" style={{ flex: 1 }} wrap="nowrap">
																		{/* Set Badge */}
																		<Center style={{
																			width: '40px',
																			height: '24px',
																			borderRadius: '4px',
																			backgroundColor: isChecked ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-blue-9)',
																			color: isChecked ? 'var(--mantine-color-dark-3)' : 'var(--mantine-color-blue-0)',
																			fontWeight: 800,
																			fontSize: '12px'
																		}}>
																			{idx + 1}
																		</Center>

																		{/* Reps */}
																		<Text size="sm" fw={700} style={{ width: '70px', textAlign: 'center', textDecoration: isChecked ? 'line-through' : 'none' }}>
																			{s.repetitions} reps
																		</Text>

																		{/* Weight */}
																		<Text size="sm" fw={700} style={{ width: '60px', textAlign: 'center', textDecoration: isChecked ? 'line-through' : 'none' }}>
																			{s.weight || 0} kg
																		</Text>
																	</Group>

																	{/* Checkbox */}
																	<Center style={{ width: '40px' }}>
																		<Checkbox
																			checked={isChecked}
																			onChange={() => {}}
																			radius="md"
																			size="sm"
																			color="green"
																			styles={{ input: { cursor: 'pointer' } }}
																		/>
																	</Center>
																</Group>
															</Paper>
														)
													})}

													{/* Timer row */}
													{we.sets?.[0] && (
														<Paper
															p="xs"
															radius="sm"
															style={{
																backgroundColor: 'var(--mantine-color-dark-7)',
																border: '1px solid var(--mantine-color-dark-5)',
																marginTop: '4px',
															}}
														>
															<Group justify="space-between" wrap="nowrap">
																<Group gap="sm" style={{ flex: 1 }}>
																	<Center style={{ width: '40px', fontSize: '14px' }}>
																		⏰
																	</Center>
																	<Text
																		size="sm"
																		fw={700}
																	>
																		Tempo de Descanso • {restTimeMin} Min
																	</Text>
																</Group>
															</Group>
														</Paper>
													)}
												</Stack>
											)}
										</Stack>
									</Paper>
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

					{/* Finalizar Treino Button */}
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
