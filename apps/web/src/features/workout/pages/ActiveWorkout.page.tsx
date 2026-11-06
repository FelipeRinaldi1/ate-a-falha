import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Container, Stack, Text, Button, Center, Loader, Paper, Group, Image, Checkbox, Divider } from '@mantine/core'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { MainLayout } from '../../../components/layout/MainLayout'
import { api } from '../../../api/axiosInstance'
import { type PlanDTO, type WorkoutDTO, type WorkoutExerciseDTO, type SetDTO } from '@ate-a-falha/shared'
import { getExerciseImageUrl } from '../../../utils/exerciseImage'
import { useGoBack } from '../../../utils/navigation'
import { useAuth } from '../../user/hooks/useAuth'
import { useCreateNotification } from '../../notification/hooks/useNotifications'

function formatRestDuration(seconds: number): string {
	if (!seconds || seconds <= 0) return '0s'
	if (seconds < 60) return `${seconds}s`
	const mins = Math.floor(seconds / 60)
	const rem = seconds % 60
	return rem > 0 ? `${mins}m ${rem}s` : `${mins} min`
}

export function ActiveWorkoutPage() {
	const { id } = useParams<{ id: string }>()
	const [searchParams] = useSearchParams()
	const workoutId = searchParams.get('workoutId')
	const navigate = useNavigate()
	const location = useLocation()
	const goBack = useGoBack('/workout')
	const { user } = useAuth()
	const createNotificationMutation = useCreateNotification()
	const [activeTimers, setActiveTimers] = useState<Record<string, number>>({})

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

	useEffect(() => {
		const hasRunning = Object.values(activeTimers).some((v) => v > 0)
		if (!hasRunning) return

		const interval = setInterval(() => {
			setActiveTimers((prev) => {
				const next: Record<string, number> = {}
				for (const [k, v] of Object.entries(prev)) {
					if (v > 1) next[k] = v - 1
				}
				return next
			})
		}, 1000)

		return () => clearInterval(interval)
	}, [activeTimers])

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

		const workoutLabel = activeWorkout?.name || `Treino ${activeWorkout?.day || ''}`.trim()
		createNotificationMutation.mutate({
			title: 'Treino Concluído',
			message: `Você finalizou o ${workoutLabel}. Bom descanso!`,
			type: 'WORKOUT',
			link: '/workout',
		})

		// Mark today's date as completed in localStorage (scoped by user)
		try {
			const today = new Date()
			const year = today.getFullYear()
			const month = String(today.getMonth() + 1).padStart(2, '0')
			const day = String(today.getDate()).padStart(2, '0')
			const todayStr = `${year}-${month}-${day}`
			const storageKey = user?.id ? `ate-a-falha:completed-workouts:${user.id}` : 'ate-a-falha:completed-workouts'

			const saved = localStorage.getItem(storageKey)
			const completed = saved ? JSON.parse(saved) : {}
			completed[todayStr] = true
			localStorage.setItem(storageKey, JSON.stringify(completed))
		} catch (e) {
			console.error('Failed to save completed workout', e)
		}

		const historyIdx = window.history.state?.idx ?? 0
		const cameFromSelect = (location.state as { fromSelect?: boolean } | null)?.fromSelect
		if (cameFromSelect && historyIdx >= 2) {
			navigate(-2)
		} else {
			goBack('/workout')
		}
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

	if (isLoading) {
		return (
			<MainLayout title="Ficha - Exercícios" onBack={() => goBack('/workout')}>
				<Center style={{ height: '70vh' }}>
					<Loader size="lg" />
				</Center>
			</MainLayout>
		)
	}

	return (
		<MainLayout title={`${plan?.name || 'Ficha'} - Exercícios`} onBack={() => goBack('/workout')}>
			<Container size="xs" px={0}>
				<Stack gap="md" pb={100} pt="md">
					{/* Active Workout Info Header */}
					{activeWorkout && (
						<Text fw={700} size="sm" c="dimmed" style={{ textAlign: 'center' }}>
							Treino {activeWorkout.day} - {activeWorkout.name || 'Sem Foco'}
						</Text>
					)}

					{/* Exercises List mimicking the mockup */}
					<Stack gap="md">
						{activeWorkout?.workoutExercises && activeWorkout.workoutExercises.length > 0 ? (
							activeWorkout.workoutExercises.map((we: WorkoutExerciseDTO) => {
								const weId = we.id
								const isExpanded = !!expandedExercises[weId]
								const imagePath = we.exercise?.images?.[0]
								const exerciseImageUrl = getExerciseImageUrl(imagePath, true)

								const totalSets = we.sets?.length || 0
								const restSeconds = we.sets?.[0]?.restTimeSeconds ?? 60
								const restTimeFormatted = formatRestDuration(restSeconds)
								const remainingTimer = activeTimers[weId] || 0
								const isExerciseCompleted =
									we.sets && we.sets.length > 0 && we.sets.every((s: SetDTO) => !!checkedItems[s.id])

								return (
									<Paper
										key={weId}
										withBorder
										radius="md"
										style={{
											overflow: 'hidden',
											backgroundColor: isExerciseCompleted
												? 'rgba(40, 167, 69, 0.1)'
												: 'var(--mantine-color-dark-6)',
											borderColor: isExerciseCompleted
												? 'var(--mantine-color-green-7)'
												: 'var(--mantine-color-dark-4)',
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
												<div
													style={{
														width: '60px',
														height: '60px',
														flexShrink: 0,
														overflow: 'hidden',
														borderRadius: '8px',
														backgroundColor: 'var(--mantine-color-dark-8)',
													}}
												>
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
														<Text size="xs" c="dimmed">
															•
														</Text>
														<Text size="xs" c="dimmed" fw={600}>
															{restTimeFormatted} desc
														</Text>
													</Group>
												</Stack>
												<div
													style={{
														color: 'var(--mantine-color-dark-2)',
														display: 'flex',
														alignItems: 'center',
													}}
												>
													{isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
												</div>
											</Group>

											{/* Expanded items section */}
											{isExpanded && (
												<Stack gap="xs" px="md" pb="md">
													<Divider color="dark.4" />

													{we.exercise?.instructions &&
														we.exercise.instructions.length > 0 && (
															<div
																style={{
																	backgroundColor: 'var(--mantine-color-dark-8)',
																	padding: '10px',
																	borderRadius: '6px',
																	border: '1px solid var(--mantine-color-dark-5)',
																	marginBottom: '4px',
																}}
															>
																<Text size="xs" fw={800} c="blue.4" mb={6}>
																	Instruções / Execução:
																</Text>
																<Stack gap={4}>
																	{we.exercise.instructions.map(
																		(step: string, i: number) => (
																			<Text
																				key={i}
																				size="11px"
																				style={{ lineHeight: 1.35 }}
																			>
																				<strong>{i + 1}.</strong> {step}
																			</Text>
																		)
																	)}
																</Stack>
															</div>
														)}

													{/* Sets Table Header */}
													<Group
														justify="space-between"
														px="xs"
														py={4}
														style={{
															color: 'var(--mantine-color-gray-5)',
															fontSize: '11px',
															fontWeight: 700,
															textTransform: 'uppercase',
															letterSpacing: '0.5px',
														}}
													>
														<Group gap="md" style={{ flex: 1 }} wrap="nowrap">
															<Text
																size="11px"
																fw={700}
																style={{ width: '40px', textAlign: 'center' }}
															>
																Série
															</Text>
															<Text
																size="11px"
																fw={700}
																style={{ width: '70px', textAlign: 'center' }}
															>
																Repetições
															</Text>
															<Text
																size="11px"
																fw={700}
																style={{ width: '60px', textAlign: 'center' }}
															>
																Carga
															</Text>
														</Group>
														<Text
															size="11px"
															fw={700}
															style={{ width: '40px', textAlign: 'center' }}
														>
															Feito
														</Text>
													</Group>

													{we.sets?.map((s: SetDTO, idx: number) => {
														const setId = s.id
														const isChecked = !!checkedItems[setId]
														return (
															<Paper
																key={setId}
																p="xs"
																radius="sm"
																style={{
																	backgroundColor: isChecked
																		? 'var(--mantine-color-dark-8)'
																		: 'var(--mantine-color-dark-7)',
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
																		<Center
																			style={{
																				width: '40px',
																				height: '24px',
																				borderRadius: '4px',
																				backgroundColor: isChecked
																					? 'var(--mantine-color-dark-7)'
																					: 'var(--mantine-color-blue-9)',
																				color: isChecked
																					? 'var(--mantine-color-dark-3)'
																					: 'var(--mantine-color-blue-0)',
																				fontWeight: 800,
																				fontSize: '12px',
																			}}
																		>
																			{idx + 1}
																		</Center>

																		{/* Reps */}
																		<Text
																			size="sm"
																			fw={700}
																			style={{
																				width: '70px',
																				textAlign: 'center',
																				textDecoration: isChecked
																					? 'line-through'
																					: 'none',
																			}}
																		>
																			{s.repetitions} reps
																		</Text>

																		{/* Weight */}
																		<Text
																			size="sm"
																			fw={700}
																			style={{
																				width: '60px',
																				textAlign: 'center',
																				textDecoration: isChecked
																					? 'line-through'
																					: 'none',
																			}}
																		>
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
																backgroundColor:
																	remainingTimer > 0
																		? 'rgba(34, 139, 230, 0.15)'
																		: 'var(--mantine-color-dark-7)',
																border:
																	remainingTimer > 0
																		? '1px solid var(--mantine-color-blue-6)'
																		: '1px solid var(--mantine-color-dark-5)',
																marginTop: '4px',
																cursor: 'pointer',
															}}
															onClick={() => {
																setActiveTimers((prev) => {
																	if (prev[weId] && prev[weId] > 0) {
																		const copy = { ...prev }
																		delete copy[weId]
																		return copy
																	}
																	return { ...prev, [weId]: restSeconds }
																})
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
																		c={remainingTimer > 0 ? 'blue.4' : undefined}
																	>
																		{remainingTimer > 0
																			? `Descansando: ${formatRestDuration(remainingTimer)} (toque p/ parar)`
																			: `Tempo de Descanso • ${restTimeFormatted} (toque p/ iniciar)`}
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
