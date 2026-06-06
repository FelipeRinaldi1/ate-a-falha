import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
	Container,
	Stack,
	Text,
	Group,
	Button,
	Center,
	Loader,
	Paper,
	ActionIcon,
	Modal,
	TextInput,
	Select,
	Image,
	Divider,
	NumberInput,
	Card,
	Badge,
	SimpleGrid,
} from '@mantine/core'
import { Plus, Trash2, Search, Star } from 'lucide-react'
import { MainLayout } from '../../../components/layout/MainLayout'
import { api } from '../../../api/axiosInstance'
import { type ExerciseDTO, type PlanDTO, type WorkoutDTO, type WorkoutExerciseDTO, type SetDTO } from '@ate-a-falha/shared'

type DivisionType = 'A' | 'AB' | 'ABC' | 'ABCD' | 'ABCDE' | 'ABCDEF'

const DIVISION_DAYS: Record<DivisionType, string[]> = {
	A: ['A'],
	AB: ['A', 'B'],
	ABC: ['A', 'B', 'C'],
	ABCD: ['A', 'B', 'C', 'D'],
	ABCDE: ['A', 'B', 'C', 'D', 'E'],
	ABCDEF: ['A', 'B', 'C', 'D', 'E', 'F'],
}

// Localized muscle groups constants
const MUSCLE_OPTIONS = [
	{ label: 'Abdominais', value: 'abdominais' },
	{ label: 'Adutores', value: 'adutores' },
	{ label: 'Antebraço', value: 'antebraco' },
	{ label: 'Bíceps', value: 'biceps' },
	{ label: 'Costas (Inferior)', value: 'inferior-das-costas' },
	{ label: 'Costas (Médio)', value: 'meio-das-costas' },
	{ label: 'Dorsais', value: 'dorsais' },
	{ label: 'Glúteos', value: 'gluteos' },
	{ label: 'Isquiotibiais', value: 'isquiotibiais' },
	{ label: 'Ombros', value: 'ombros' },
	{ label: 'Panturrilhas', value: 'panturrilhas' },
	{ label: 'Peito', value: 'peito' },
	{ label: 'Pescoço', value: 'pescoco' },
	{ label: 'Quadríceps', value: 'quadriceps' },
	{ label: 'Trapézio', value: 'trapezio' },
	{ label: 'Tríceps', value: 'triceps' },
]

// Localized exercise categories constants
const CATEGORY_OPTIONS = [
	{ label: 'Alongamento', value: 'alongamento' },
	{ label: 'Cardio', value: 'cardio' },
	{ label: 'Força', value: 'força' },
	{ label: 'Levantamento Olímpico', value: 'levantamento-olimpico' },
	{ label: 'Pliometria', value: 'plyometrics' },
	{ label: 'Strongman', value: 'strongman' },
]

export function EditPlanPage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [planName, setPlanName] = useState('')
	const [selectedDivision, setSelectedDivision] = useState<DivisionType>('ABC')
	const [workoutNames, setWorkoutNames] = useState<Record<string, string>>({}) // key: day, value: name
	const [workoutWeekDays, setWorkoutWeekDays] = useState<Record<string, string | null>>({}) // key: day, value: weekDay string
	const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
	const [coverExerciseId, setCoverExerciseId] = useState<string | null>(null)

	// Modal states
	const [exerciseModalOpen, setExerciseModalOpen] = useState(false)
	const [targetDayForExercise, setTargetDayForExercise] = useState<string | null>(null)
	const [exerciseSearch, setExerciseSearch] = useState('')
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
	const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null)

	// Sets modal states
	const [setsModalOpen, setSetsModalOpen] = useState(false)
	const [editingWorkoutExerciseId, setEditingWorkoutExerciseId] = useState<string | null>(null)
	const [editingSets, setEditingSets] = useState<{ id?: string; setNumber: number; repetitions: number; weight: number; restTimeSeconds: number }[]>([])

	// Fetch Plan details (includes workouts, exercises, sets)
	const { data: plan, isLoading } = useQuery<PlanDTO>({
		queryKey: ['workout-plans-detail', id],
		queryFn: async () => {
			const res = await api.get(`/workout/plans/${id}`)
			return res.data
		},
		enabled: !!id,
		refetchOnWindowFocus: false,
		staleTime: 300000, // 5 minutes
	})

	// Fetch Exercise Catalog for adding exercises
	const { data: catalog = [] } = useQuery<ExerciseDTO[]>({
		queryKey: ['exercise-catalog-all-options'],
		queryFn: async () => {
			const res = await api.get('/workout/exercise-catalog', { params: { take: 800 } })
			return res.data
		},
	})

	// Initialize states when plan is loaded
	useEffect(() => {
		if (plan) {
			setPlanName(plan.name)
			setCoverImageUrl(plan.coverImageUrl || null)
			setCoverExerciseId(plan.coverExerciseId || null)
			
			// Detect division based on existing workouts
			const days = plan.workouts?.map((w: WorkoutDTO) => w.day) || []
			let maxDiv: DivisionType = 'A'
			if (days.includes('F')) maxDiv = 'ABCDEF'
			else if (days.includes('E')) maxDiv = 'ABCDE'
			else if (days.includes('D')) maxDiv = 'ABCD'
			else if (days.includes('C')) maxDiv = 'ABC'
			else if (days.includes('B')) maxDiv = 'AB'
			
			setSelectedDivision(maxDiv)

			const names: Record<string, string> = {}
			const weekDays: Record<string, string | null> = {}
			plan.workouts?.forEach((w: WorkoutDTO) => {
				names[w.day] = w.name || ''
				weekDays[w.day] = w.weekDay || null
			})
			setWorkoutNames(names)
			setWorkoutWeekDays(weekDays)
		}
	}, [plan])

	const savePlanMutation = useMutation({
		mutationFn: async () => {
			// 1. Update plan name & cover images
			const patchPlanPromise = api.patch(`/workout/plans/${id}`, { 
				name: planName,
				coverImageUrl,
				coverExerciseId,
			})

			// 2. Update all active workouts names and weekDays in parallel
			const activeDays = DIVISION_DAYS[selectedDivision]
			const workoutPromises = activeDays.map((day) => {
				const existingWorkout = plan?.workouts?.find((w: WorkoutDTO) => w.day === day)
				const wName = workoutNames[day] || `Treino ${day}`
				const wWeekDay = workoutWeekDays[day] || null
				if (existingWorkout) {
					return api.patch(`/workout/workouts/${existingWorkout.id}`, { name: wName, weekDay: wWeekDay })
				} else {
					return api.post(`/workout/plans/${id}/workouts`, { name: wName, day, weekDay: wWeekDay })
				}
			})

			await Promise.all([patchPlanPromise, ...workoutPromises])
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['workout-plans'] })
			queryClient.invalidateQueries({ queryKey: ['workout-plans-detail', id] })
			navigate('/workout/plans')
		},
	})

	// Mutation: Add Exercise to Workout
	const addExerciseMutation = useMutation({
		mutationFn: async ({ day, exerciseId }: { day: string; exerciseId: string }) => {
			let workout = plan?.workouts?.find((w: WorkoutDTO) => w.day === day)
			
			// If workout doesn't exist yet, create it first
			if (!workout) {
				const res = await api.post(`/workout/plans/${id}/workouts`, {
					name: workoutNames[day] || `Treino ${day}`,
					day,
				})
				workout = res.data
			}

			if (!workout) return

			// Add the exercise
			const orderIndex = workout.workoutExercises?.length || 0
			const exerciseRes = await api.post(`/workout/workouts/${workout.id}/exercises`, {
				exerciseId,
				orderIndex,
			})
			const newExercise = exerciseRes.data

			// Create 3 default sets
			for (let i = 1; i <= 3; i++) {
				await api.post(`/workout/workout-exercises/${newExercise.id}/sets`, {
					setNumber: i,
					repetitions: 10,
					weight: 0,
					restTimeSeconds: 60,
				})
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['workout-plans-detail', id] })
			setExerciseModalOpen(false)
		},
	})

	// Mutation: Delete Exercise
	const deleteExerciseMutation = useMutation({
		mutationFn: async (workoutExerciseId: string) => {
			return api.delete(`/workout/workout-exercises/${workoutExerciseId}`)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['workout-plans-detail', id] })
		},
	})

	// Mutation: Update Sets
	const updateSetsMutation = useMutation({
		mutationFn: async () => {
			if (!editingWorkoutExerciseId) return

			// 1. Fetch current sets to delete or update
			const res = await api.get(`/workout/workout-exercises/${editingWorkoutExerciseId}/sets`)
			const currentSets = res.data

			// 2. Delete all current sets in parallel (backend simplicity)
			await Promise.all(currentSets.map((set: SetDTO) => api.delete(`/workout/sets/${set.id}`)))

			// 3. Insert updated sets in parallel
			const postPromises = editingSets.map((set, i) =>
				api.post(`/workout/workout-exercises/${editingWorkoutExerciseId}/sets`, {
					setNumber: i + 1,
					repetitions: set.repetitions,
					weight: set.weight,
					restTimeSeconds: set.restTimeSeconds,
				})
			)
			await Promise.all(postPromises)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['workout-plans-detail', id] })
			setSetsModalOpen(false)
			setEditingWorkoutExerciseId(null)
		},
	})

	const handleOpenSetsModal = (workoutExercise: WorkoutExerciseDTO) => {
		setEditingWorkoutExerciseId(workoutExercise.id)
		const sets = workoutExercise.sets?.map((s: SetDTO) => ({
			id: s.id,
			setNumber: s.setNumber,
			repetitions: s.repetitions,
			weight: s.weight || 0,
			restTimeSeconds: s.restTimeSeconds,
		})) || []

		// Default to 3 sets if empty
		if (sets.length === 0) {
			setEditingSets([
				{ setNumber: 1, repetitions: 10, weight: 0, restTimeSeconds: 60 },
				{ setNumber: 2, repetitions: 10, weight: 0, restTimeSeconds: 60 },
				{ setNumber: 3, repetitions: 10, weight: 0, restTimeSeconds: 60 },
			])
		} else {
			setEditingSets(sets)
		}
		setSetsModalOpen(true)
	}

	const handleAddSet = () => {
		const newNumber = editingSets.length + 1
		const lastSet = editingSets[editingSets.length - 1] || { repetitions: 10, weight: 0, restTimeSeconds: 60 }
		setEditingSets([
			...editingSets,
			{
				setNumber: newNumber,
				repetitions: lastSet.repetitions,
				weight: lastSet.weight,
				restTimeSeconds: lastSet.restTimeSeconds,
			},
		])
	}

	const handleRemoveSet = (index: number) => {
		const updated = editingSets.filter((_, i) => i !== index).map((s, i) => ({ ...s, setNumber: i + 1 }))
		setEditingSets(updated)
	}

	const handleUpdateSetField = (index: number, field: string, value: string | number) => {
		const updated = [...editingSets]
		updated[index] = { ...updated[index], [field]: value }
		setEditingSets(updated)
	}

	// Filter exercises in catalog
	const filteredCatalog = catalog.filter((ex) => {
		const matchesSearch =
			ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
			ex.primaryMuscles.some((m) => m.toLowerCase().includes(exerciseSearch.toLowerCase())) ||
			ex.category.toLowerCase().includes(exerciseSearch.toLowerCase())

		const matchesCategory = !selectedCategory || ex.category.toLowerCase() === selectedCategory.toLowerCase()
		const matchesMuscle = !selectedMuscle || ex.primaryMuscles.some((m) => m.toLowerCase() === selectedMuscle.toLowerCase())

		return matchesSearch && matchesCategory && matchesMuscle
	})

	const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1'
	const activeDays = DIVISION_DAYS[selectedDivision]

	if (isLoading || !plan) {
		return (
			<MainLayout title="Editar Ficha" onBack={() => navigate(-1)}>
				<Center style={{ height: '70vh' }}>
					<Loader size="lg" />
				</Center>
			</MainLayout>
		)
	}

	return (
		<MainLayout title="Editar Ficha" onBack={() => navigate(-1)}>
			<Container size="xs" px={0}>
				<Stack gap="md" pb={100}>
					{/* Form Fields wrapped in Paper */}
					<Paper withBorder p="md" shadow="sm" radius="md">
						<Stack gap="md">
							<Select
								label="Divisão de Treino"
								placeholder="Selecione a divisão..."
								value={selectedDivision}
								onChange={(val) => val && setSelectedDivision(val as DivisionType)}
								data={[
									{ label: 'Treino A (1 Dia)', value: 'A' },
									{ label: 'Treino AB (2 Dias)', value: 'AB' },
									{ label: 'Treino ABC (3 Dias)', value: 'ABC' },
									{ label: 'Treino ABCD (4 Dias)', value: 'ABCD' },
									{ label: 'Treino ABCDE (5 Dias)', value: 'ABCDE' },
									{ label: 'Treino ABCDEF (6 Dias)', value: 'ABCDEF' },
								]}
								radius="md"
							/>
							<TextInput
								label="Nome Da Ficha"
								placeholder="Nome da ficha de treino"
								value={planName}
								onChange={(e) => setPlanName(e.currentTarget.value)}
								radius="md"
							/>
						</Stack>
					</Paper>

					{/* Workouts corresponding in order to days A-F */}
					<Stack gap="md">
						{activeDays.map((day) => {
							const workout = plan.workouts?.find((w: WorkoutDTO) => w.day === day)
							const currentWorkoutName = workoutNames[day] ?? (workout?.name || '')
							const exercises = workout?.workoutExercises || []

							return (
								<Paper key={day} withBorder p="md" shadow="sm" radius="md">
									<Stack gap="sm">
										<Group justify="space-between" align="center">
											<Text fw={800} size="md" c="blue">
												Treino {day}
											</Text>
											<TextInput
												placeholder="Foco (Ex: Peito e Tríceps)"
												value={currentWorkoutName}
												onChange={(e) => setWorkoutNames({ ...workoutNames, [day]: e.currentTarget.value })}
												variant="unstyled"
												style={{ textAlign: 'right', fontWeight: 600, borderBottom: '1px dashed var(--mantine-color-dark-4)' }}
											/>
										</Group>

										<Select
											placeholder="Selecione o dia da semana..."
											value={workoutWeekDays[day] || null}
											onChange={(val) => setWorkoutWeekDays({ ...workoutWeekDays, [day]: val })}
											data={[
												{ label: 'Segunda-feira', value: '1' },
												{ label: 'Terça-feira', value: '2' },
												{ label: 'Quarta-feira', value: '3' },
												{ label: 'Quinta-feira', value: '4' },
												{ label: 'Sexta-feira', value: '5' },
												{ label: 'Sábado', value: '6' },
												{ label: 'Domingo', value: '0' },
											]}
											clearable
											radius="md"
											size="xs"
											style={{ maxWidth: 200, alignSelf: 'flex-end' }}
										/>

										{/* Workout Exercises */}
										<Stack gap="xs" mt="xs">
											{exercises.length > 0 ? (
												exercises.map((we: WorkoutExerciseDTO) => {
													const imagePath = we.exercise?.images?.[0]
													const exerciseImageUrl = imagePath
														? `${apiBaseUrl}/assets/exercises/${imagePath.endsWith('.webp') ? imagePath : imagePath.replace(/\.[^/.]+$/, '.webp')}`
														: 'https://placehold.co/80x80?text=Exercício'
													
													const totalSets = we.sets?.length || 0
													const reps = we.sets?.[0]?.repetitions || 10
													const rest = we.sets?.[0]?.restTimeSeconds || 60

													return (
														<Card
															key={we.id}
															withBorder
															p="md"
															radius="sm"
															style={{ cursor: 'pointer', backgroundColor: 'var(--mantine-color-dark-6)' }}
															onClick={() => handleOpenSetsModal(we)}
														>
															<Group justify="space-between" wrap="nowrap">
																<Group gap="md" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
																	<div style={{ width: '80px', height: '80px', flexShrink: 0, overflow: 'hidden', borderRadius: '6px' }}>
																		<Image
																			src={exerciseImageUrl}
																			w={80}
																			h={80}
																			fit="cover"
																			fallbackSrc="https://placehold.co/80x80?text=Exercício"
																		/>
																	</div>
																	<Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
																		<Text fw={700} size="sm" truncate>
																			{we.exercise?.name}
																		</Text>
																		<Text size="11px" c="dimmed" fw={600}>
																			{totalSets} séries x {reps} reps ({rest}s desc.)
																		</Text>
																	</Stack>
																</Group>
																<Group gap="xs">
																	<ActionIcon
																		variant="subtle"
																		color={coverExerciseId === we.exercise?.id ? 'yellow' : 'gray'}
																		size="sm"
																		onClick={(e) => {
																			e.stopPropagation()
																			if (coverExerciseId === we.exercise?.id) {
																				setCoverExerciseId(null)
																				setCoverImageUrl(null)
																			} else {
																				setCoverExerciseId(we.exercise?.id || null)
																				setCoverImageUrl(we.exercise?.images?.[0] || null)
																			}
																		}}
																		title={coverExerciseId === we.exercise?.id ? 'Remover foto de capa' : 'Definir como foto de capa'}
																	>
																		<Star
																			size={15}
																			fill={coverExerciseId === we.exercise?.id ? 'currentColor' : 'none'}
																		/>
																	</ActionIcon>
																	<ActionIcon
																		variant="subtle"
																		color="red"
																		size="sm"
																		onClick={(e) => {
																			e.stopPropagation()
																			deleteExerciseMutation.mutate(we.id)
																		}}
																	>
																		<Trash2 size={15} />
																	</ActionIcon>
																</Group>
															</Group>
														</Card>
													)
												})
											) : (
												<Text size="xs" c="dimmed" style={{ textAlign: 'center', padding: '10px 0' }}>
													Nenhum exercício neste treino.
												</Text>
											)}
										</Stack>

										{/* Adicionar Exercício Button */}
										<Button
											leftSection={<Plus size={16} />}
											variant="light"
											color="blue"
											size="xs"
											fullWidth
											mt="xs"
											onClick={() => {
												setTargetDayForExercise(day)
												setExerciseModalOpen(true)
											}}
										>
											Adicionar Exercício
										</Button>
									</Stack>
								</Paper>
							)
						})}
					</Stack>

					{/* Bottom Concluir Button */}
					<Button
						size="lg"
						radius="xl"
						color="blue"
						fullWidth
						mt="xl"
						onClick={() => savePlanMutation.mutate()}
						loading={savePlanMutation.isPending}
						style={{
							boxShadow: '0 8px 24px rgba(34, 139, 230, 0.3)',
							fontWeight: 800,
						}}
					>
						Concluir
					</Button>
				</Stack>
			</Container>

			{/* Search & Add Exercise Modal */}
			<Modal
				opened={exerciseModalOpen}
				onClose={() => setExerciseModalOpen(false)}
				title={`Adicionar Exercício ao Treino ${targetDayForExercise}`}
				centered
				radius="md"
				size="95%"
			>
				<Stack gap="md" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
					<TextInput
						placeholder="Buscar no catálogo..."
						value={exerciseSearch}
						onChange={(e) => setExerciseSearch(e.currentTarget.value)}
						leftSection={<Search size={16} />}
						radius="md"
					/>

					{/* Dropdown Filters dynamically synchronized */}
					<SimpleGrid cols={2} spacing="xs">
						<Select
							placeholder="Músculo Foco"
							data={MUSCLE_OPTIONS}
							value={selectedMuscle}
							onChange={setSelectedMuscle}
							clearable
							radius="md"
						/>
						<Select
							placeholder="Categoria"
							data={CATEGORY_OPTIONS}
							value={selectedCategory}
							onChange={setSelectedCategory}
							clearable
							radius="md"
						/>
					</SimpleGrid>
					
					<Stack gap="xs">
						{filteredCatalog.slice(0, 15).map((ex) => {
							const imagePath = ex.images?.[0]
							const exerciseImageUrl = imagePath
								? `${apiBaseUrl}/assets/exercises/${imagePath.endsWith('.webp') ? imagePath : imagePath.replace(/\.[^/.]+$/, '.webp')}`
								: 'https://placehold.co/80x80?text=Exercício'

							return (
								<Card
									key={ex.id}
									withBorder
									p="sm"
									radius="sm"
									style={{ cursor: 'pointer' }}
									onClick={() => targetDayForExercise && addExerciseMutation.mutate({ day: targetDayForExercise, exerciseId: ex.id })}
								>
									<Group gap="md" wrap="nowrap" align="center">
										<div style={{ width: '70px', height: '70px', flexShrink: 0, overflow: 'hidden', borderRadius: '6px' }}>
											<Image src={exerciseImageUrl} w={70} h={70} fit="cover" />
										</div>
										<Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
											<Text fw={700} size="sm" truncate>
												{ex.name}
											</Text>
											<Badge
												color="red.6"
												variant="light"
												style={{
													fontSize: '9px',
													flexShrink: 0,
													textTransform: 'none',
													height: 'auto',
													padding: '3px 8px',
													width: 'fit-content'
												}}
											>
												{ex.primaryMuscles?.[0] || 'Músculo'}
											</Badge>
										</Stack>
									</Group>
								</Card>
							)
						})}
					</Stack>
				</Stack>
			</Modal>

			{/* Edit Sets Modal */}
			<Modal
				opened={setsModalOpen}
				onClose={() => setSetsModalOpen(false)}
				title="Configurar Séries e Repetições"
				centered
				radius="md"
			>
				<Stack gap="md">
					<Text size="xs" c="dimmed">
						Ajuste a quantidade de séries, repetições e tempos de descanso para este exercício.
					</Text>

					<Stack gap="xs">
						{editingSets.map((set, index) => (
							<Paper key={index} withBorder p="xs" radius="sm" bg="var(--mantine-color-dark-7)">
								<Stack gap="xs">
									<Group justify="space-between" align="center">
										<Text fw={700} size="xs" c="blue">
											Série {index + 1}
										</Text>
										<ActionIcon
											variant="subtle"
											color="red"
											size="xs"
											disabled={editingSets.length <= 1}
											onClick={() => handleRemoveSet(index)}
										>
											<Trash2 size={13} />
										</ActionIcon>
									</Group>

									<SimpleGrid cols={3} spacing="xs">
										<NumberInput
											label="Repetições"
											value={set.repetitions}
											min={1}
											max={100}
											onChange={(val) => handleUpdateSetField(index, 'repetitions', Number(val) || 10)}
											size="xs"
										/>
										<NumberInput
											label="Carga (Kg)"
											value={set.weight}
											min={0}
											max={500}
											onChange={(val) => handleUpdateSetField(index, 'weight', Number(val) || 0)}
											size="xs"
										/>
										<NumberInput
											label="Descanso (s)"
											value={set.restTimeSeconds}
											min={0}
											max={600}
											onChange={(val) => handleUpdateSetField(index, 'restTimeSeconds', Number(val) || 60)}
											size="xs"
										/>
									</SimpleGrid>
								</Stack>
							</Paper>
						))}
					</Stack>

					<Button
						variant="outline"
						color="blue"
						size="xs"
						onClick={handleAddSet}
					>
						+ Adicionar Série
					</Button>

					<Divider />

					<Button
						color="blue"
						fullWidth
						onClick={() => updateSetsMutation.mutate()}
						loading={updateSetsMutation.isPending}
					>
						Confirmar Alterações
					</Button>
				</Stack>
			</Modal>
		</MainLayout>
	)
}
