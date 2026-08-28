import { useState } from 'react'
import {
	Container,
	Stack,
	Text,
	Card,
	Image,
	Badge,
	Group,
	Button,
	ScrollArea,
	UnstyledButton,
	Center,
	Loader,
	Paper,
} from '@mantine/core'
import { Dumbbell, ArrowRight, Play, CheckCircle2, Circle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '../../../components/layout/MainLayout'
import { api } from '../../../api/axiosInstance'
import { type PlanDTO, type ExerciseDTO, type WorkoutDTO } from '@ate-a-falha/shared'
import { CalendarSelector } from '../../../components/CalendarSelector'
import { getExerciseImageUrl } from '../../../utils/exerciseImage'

export function WorkoutDashboardPage() {
	const navigate = useNavigate()
	const [selectedDate, setSelectedDate] = useState<Date>(new Date())

	// Completed workouts state stored in localStorage (YYYY-MM-DD -> boolean)
	const [completedWorkouts, setCompletedWorkouts] = useState<Record<string, boolean>>(() => {
		try {
			const saved = localStorage.getItem('ate-a-falha:completed-workouts')
			return saved ? JSON.parse(saved) : {}
		} catch {
			return {}
		}
	})

	const toggleDayCompleted = (dateStr: string) => {
		setCompletedWorkouts((prev) => {
			const updated = { ...prev, [dateStr]: !prev[dateStr] }
			localStorage.setItem('ate-a-falha:completed-workouts', JSON.stringify(updated))
			return updated
		})
	}

	const { data: plans = [], isLoading: isLoadingPlans } = useQuery<PlanDTO[]>({
		queryKey: ['workout-plans'],
		queryFn: async () => {
			const res = await api.get('/workout/plans')
			return res.data
		},
	})

	const { data: exercises = [], isLoading: isLoadingExercises } = useQuery<ExerciseDTO[]>({
		queryKey: ['exercise-catalog'],
		queryFn: async () => {
			const res = await api.get('/workout/exercise-catalog', { params: { random: true } })
			return res.data
		},
	})

	const activePlan = plans.find((p) => p.isActive) || plans[0]

	const scheduledWorkouts: Record<string, string> = {}
	activePlan?.workouts?.forEach((w: WorkoutDTO) => {
		if (w.weekDay) {
			scheduledWorkouts[w.weekDay] = w.day
		}
	})

	const selectedWeekDayStr = selectedDate.getDay().toString()
	const todaysWorkout = activePlan?.workouts?.find((w: WorkoutDTO) => w.weekDay === selectedWeekDayStr)

	// Generate surrounding 7 days
	const getWeekDays = () => {
		const days = []
		const current = new Date(selectedDate)
		const sunday = new Date(current.setDate(current.getDate() - current.getDay()))

		for (let i = 0; i < 7; i++) {
			const day = new Date(sunday)
			day.setDate(sunday.getDate() + i)
			days.push(day)
		}
		return days
	}

	const formatDateString = (d: Date) => {
		const year = d.getFullYear()
		const month = String(d.getMonth() + 1).padStart(2, '0')
		const day = String(d.getDate()).padStart(2, '0')
		return `${year}-${month}-${day}`
	}

	const weekDays = getWeekDays()
	const selectedDateStr = formatDateString(selectedDate)
	const isTodayCompleted = !!completedWorkouts[selectedDateStr]

	const activeCoverUrl = getExerciseImageUrl(activePlan?.coverImageUrl, false)

	if (isLoadingPlans || isLoadingExercises) {
		return (
			<MainLayout title="Treino">
				<Center style={{ height: '70vh' }}>
					<Loader size="lg" />
				</Center>
			</MainLayout>
		)
	}

	return (
		<MainLayout title="Treino">
			<Container size="xs" px={0}>
				<Stack gap="md">
					{/* Calendar Day Selector */}
					<CalendarSelector
						weekDays={weekDays}
						selectedDateStr={selectedDateStr}
						onSelectDate={setSelectedDate}
						formatDateString={formatDateString}
						scheduledWorkouts={scheduledWorkouts}
						completedDays={completedWorkouts}
					/>

					{/* Treino do Dia Selecionado & Botão de Check */}
					<Paper withBorder p="md" radius="md" shadow="sm">
						<Stack gap="sm">
							<Group justify="space-between" align="center" wrap="nowrap">
								<Stack gap={2}>
									<Text fw={700} size="md">
										Treino do Dia
									</Text>
									<Text size="xs" c="dimmed" style={{ textTransform: 'capitalize' }}>
										{selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}
									</Text>
								</Stack>

								{/* Botão de Check para marcar se foi treinado (exibido apenas se houver treino agendado) */}
								{todaysWorkout && (
									<Button
										size="xs"
										variant={isTodayCompleted ? 'filled' : 'light'}
										color={isTodayCompleted ? 'green' : 'gray'}
										leftSection={isTodayCompleted ? <CheckCircle2 size={15} /> : <Circle size={15} />}
										onClick={() => toggleDayCompleted(selectedDateStr)}
										style={{ transition: 'all 0.2s ease' }}
									>
										{isTodayCompleted ? 'Treinado ✓' : 'Marcar Treino'}
									</Button>
								)}
							</Group>

							{todaysWorkout ? (
								<Card withBorder p="sm" radius="md" style={{ backgroundColor: 'var(--mantine-color-dark-7)' }}>
									<Group justify="space-between" align="center">
										<Stack gap={2}>
											<Group gap="xs">
												<Badge size="sm" color="blue" variant="filled">
													Treino {todaysWorkout.day}
												</Badge>
												<Text fw={700} size="sm">
													{todaysWorkout.name || `Treino ${todaysWorkout.day}`}
												</Text>
											</Group>
											<Text size="xs" c="dimmed">
												{todaysWorkout.workoutExercises?.length || 0} exercícios cadastrados
											</Text>
										</Stack>

										<Button
											size="xs"
											color="blue"
											variant="light"
											leftSection={<Play size={14} fill="currentColor" />}
											onClick={() => activePlan && navigate(`/workout/active/${activePlan.id}?workoutId=${todaysWorkout.id}`)}
										>
											Iniciar
										</Button>
									</Group>
								</Card>
							) : (
								<Card withBorder p="sm" radius="md" style={{ backgroundColor: 'var(--mantine-color-dark-7)' }}>
									<Group justify="space-between" align="center">
										<Text size="xs" c="dimmed">
											Nenhum treino agendado para este dia da semana.
										</Text>
										{activePlan && (
											<Button
												size="xs"
												variant="subtle"
												color="blue"
												onClick={() => navigate(`/workout/active/${activePlan.id}/select`)}
											>
												Escolher treino
											</Button>
										)}
									</Group>
								</Card>
							)}
						</Stack>
					</Paper>

					{/* Ficha de Treino Principal */}
					<Paper withBorder p="md" radius="md" shadow="sm">
						<Stack gap="sm">
							<Group justify="space-between" align="center">
								<Text fw={700} size="md">
									Ficha de Treino Principal
								</Text>
								<UnstyledButton onClick={() => activePlan && navigate(`/workout/plans/${activePlan.id}/edit`)}>
									<Group gap={4} c="blue">
										<Text size="xs" fw={700}>Ver todos</Text>
										<ArrowRight size={14} />
									</Group>
								</UnstyledButton>
							</Group>

							{activePlan ? (
								<Card withBorder p="md" radius="md" shadow="sm" style={{ backgroundColor: 'var(--mantine-color-dark-6)', overflow: 'hidden' }}>
									{/* Premium Cover Banner */}
									<div style={{ height: '110px', overflow: 'hidden', borderTopLeftRadius: '7px', borderTopRightRadius: '7px', position: 'relative', margin: '-16px -16px 12px -16px' }}>
										{activeCoverUrl ? (
											<Image
												src={activeCoverUrl}
												h={110}
												fit="cover"
												fallbackSrc="https://placehold.co/400x110?text=Treino"
											/>
										) : (
											<div style={{
												height: '100%',
												background: 'linear-gradient(135deg, var(--mantine-color-dark-8) 0%, var(--mantine-color-dark-5) 100%)',
											}} />
										)}
										<div style={{
											position: 'absolute',
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.65))',
										}} />
									</div>

									<Stack gap="xs">
										<Group justify="space-between" align="center">
											<Stack gap={2}>
												<Text fw={800} size="lg">
													{activePlan.name}
												</Text>
												<Text size="xs" c="dimmed">
													{activePlan.workouts?.length || 0} divisões de treino cadastradas
												</Text>
											</Stack>
											<Badge color="blue" variant="filled" size="sm">
												Ficha Ativa
											</Badge>
										</Group>
									</Stack>
								</Card>
							) : (
								<Card withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
									<Stack gap="xs" align="center">
										<Dumbbell size={32} color="gray" />
										<Text size="sm" c="dimmed">
											Nenhuma ficha de treino cadastrada.
										</Text>
										<Button size="xs" variant="light" onClick={() => navigate('/workout/plans')}>
											Criar Ficha de Treino
										</Button>
									</Stack>
								</Card>
							)}
						</Stack>
					</Paper>

					{/* Minhas Fichas de treino */}
					<Paper withBorder p="md" radius="md" shadow="sm">
						<Stack gap="sm">
							<Group justify="space-between" align="center">
								<Text fw={700} size="md">
									Minhas Fichas de treino
								</Text>
								<UnstyledButton onClick={() => navigate('/workout/plans')}>
									<Group gap={4} c="blue">
										<Text size="xs" fw={700}>Ver todos</Text>
										<ArrowRight size={14} />
									</Group>
								</UnstyledButton>
							</Group>

							<ScrollArea w="100%" scrollbars="x" type="never">
								<Group gap="md" wrap="nowrap" pb="xs">
									{plans.length > 0 ? (
										plans.map((plan) => {
											const planCoverUrl = getExerciseImageUrl(plan.coverImageUrl, true)

											return (
												<Card
													key={plan.id}
													withBorder
													p="sm"
													radius="md"
													style={{
														width: 140,
														flexShrink: 0,
														overflow: 'hidden',
														backgroundColor: plan.isActive ? 'var(--mantine-color-dark-5)' : 'var(--mantine-color-dark-6)',
														border: plan.isActive ? '1.5px solid var(--mantine-primary-color-filled)' : '1px solid var(--mantine-color-dark-4)',
														cursor: 'pointer',
													}}
													onClick={() => navigate(`/workout/active/${plan.id}/select`)}
												>
													<Card.Section>
														{planCoverUrl ? (
															<Image
																src={planCoverUrl}
																height={60}
																alt={plan.name}
																fallbackSrc="https://placehold.co/140x60?text=Treino"
																fit="cover"
																loading="lazy"
															/>
														) : (
															<div style={{
																height: '60px',
																background: 'linear-gradient(135deg, var(--mantine-color-dark-8) 0%, var(--mantine-color-dark-5) 100%)',
															}} />
														)}
													</Card.Section>
													<Stack gap="xs" justify="space-between" mt="xs" style={{ height: 70 }}>
														<Text fw={700} size="sm" lineClamp={2} style={{ whiteSpace: 'normal' }}>
															{plan.name}
														</Text>
														<Badge size="xs" color={plan.isActive ? 'blue' : 'gray'}>
															{plan.isActive ? 'Ativa' : 'Ficha'}
														</Badge>
													</Stack>
												</Card>
											)
										})
									) : (
										<Text size="xs" c="dimmed">Nenhuma ficha criada</Text>
									)}
								</Group>
							</ScrollArea>
						</Stack>
					</Paper>

					{/* Exercícios */}
					<Paper withBorder p="md" radius="md" shadow="sm">
						<Stack gap="sm">
							<Group justify="space-between" align="center">
								<Text fw={700} size="md">
									Exercícios
								</Text>
								<UnstyledButton onClick={() => navigate('/workout/exercises')}>
									<Group gap={4} c="blue">
										<Text size="xs" fw={700}>Ver todos</Text>
										<ArrowRight size={14} />
									</Group>
								</UnstyledButton>
							</Group>

							<ScrollArea w="100%" scrollbars="x" type="never">
								<Group gap="md" wrap="nowrap" pb="xs">
									{exercises.length > 0 ? (
										exercises.slice(0, 10).map((exercise) => {
											// Format exercise thumbnail image URL
											const imagePath = exercise.images?.[0]
											const exerciseImageUrl = getExerciseImageUrl(imagePath, true)

											return (
												<Card
													key={exercise.id}
													withBorder
													p="xs"
													radius="md"
													style={{ width: 140, flexShrink: 0, overflow: 'hidden', cursor: 'pointer' }}
													onClick={() => navigate(`/workout/exercises/${exercise.id}`)}
												>
													<Card.Section>
														<Image
															src={exerciseImageUrl}
															height={100}
															alt={exercise.name}
															fallbackSrc="https://placehold.co/120x120?text=Exercício"
															fit="cover"
															loading="lazy"
														/>
													</Card.Section>
													<Stack gap={4} mt="xs">
														<Text fw={700} size="xs" style={{ whiteSpace: 'normal' }} lineClamp={1}>
															{exercise.name}
														</Text>
														<Badge size="xs" color="red.6" variant="light">
															{exercise.primaryMuscles?.[0] || 'Músculo'}
														</Badge>
													</Stack>
												</Card>
											)
										})
									) : (
										<Text size="xs" c="dimmed">Nenhum exercício catalogado</Text>
									)}
								</Group>
							</ScrollArea>
						</Stack>
					</Paper>

					{/* Start Workout Button */}
					<Button
						leftSection={<Play size={20} fill="currentColor" />}
						size="lg"
						radius="xl"
						color="blue"
						fullWidth
						mt="xl"
						mb="xl"
						onClick={() => activePlan && navigate(`/workout/active/${activePlan.id}/select`)}
						style={{
							boxShadow: '0 8px 24px rgba(34, 139, 230, 0.3)',
							fontWeight: 800,
						}}
					>
						Começar Treino
					</Button>
				</Stack>
			</Container>
		</MainLayout>
	)
}
