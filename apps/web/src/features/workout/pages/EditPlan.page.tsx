import { useState, useEffect, useMemo, memo } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDebouncedValue } from '@mantine/hooks'
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
import { workoutApi } from '../api/workoutApi'
import { WORKOUT_QUERY_KEYS, usePlanDetail, useExerciseCatalogAll } from '../hooks/useWorkout'
import {
	type WorkoutDTO,
	type WorkoutExerciseDTO,
	type SetDTO,
} from '@ate-a-falha/shared'
import { getExerciseImageUrl } from '../../../utils/exerciseImage'
import { useGoBack } from '../../../utils/navigation'

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
	{ label: 'Força', value: 'forca' },
	{ label: 'Levantamento Olímpico', value: 'levantamento-olimpico' },
	{ label: 'Pliometria', value: 'plyometrics' },
	{ label: 'Strongman', value: 'strongman' },
]

const ModalExerciseSearchInput = memo(function ModalExerciseSearchInput({
	onDebouncedChange,
}: {
	onDebouncedChange: (val: string) => void
}) {
	const [value, setValue] = useState('')
	const [debounced] = useDebouncedValue(value, 200)

	useEffect(() => {
		onDebouncedChange(debounced)
	}, [debounced, onDebouncedChange])

	return (
		<TextInput
			placeholder="Buscar no catálogo..."
			value={value}
			onChange={(e) => setValue(e.currentTarget.value)}
			leftSection={<Search size={16} />}
			radius="md"
		/>
	)
})

export function EditPlanPage() {
	const { id } = useParams<{ id: string }>()
	const goBack = useGoBack('/workout/plans')
	const queryClient = useQueryClient()

	const [initializedPlanId, setInitializedPlanId] = useState<string | null>(null)
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
	const [editingSets, setEditingSets] = useState<
		{ id?: string; setNumber: number; repetitions: number; weight: number; restTimeSeconds: number }[]
	>([])

	// Fetch Plan details (includes workouts, exercises, sets)
	const { data: plan, isLoading } = usePlanDetail(id)

	// Fetch Exercise Catalog for adding exercises
	const { data: catalog = [] } = useExerciseCatalogAll()

	// Initialize states when plan is loaded
	useEffect(() => {
		if (!plan || initializedPlanId === plan.id) return

		setInitializedPlanId(plan.id)
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
	}, [plan, initializedPlanId])

	const savePlanMutation = useMutation({
		mutationFn: async () => {
			const trimmedPlanName = planName.trim()
			if (trimmedPlanName.length < 3) {
				throw new Error('O nome do plano deve ter no mínimo 3 caracteres.')
			}

			const activeDays = DIVISION_DAYS[selectedDivision]
			for (const day of activeDays) {
				const wName = (workoutNames[day] || `Treino ${day}`).trim()
				if (wName.length < 3) {
					throw new Error(`O nome do treino ${day} deve ter no mínimo 3 caracteres.`)
				}
			}

			// 1. Update plan name & cover images
			const patchPlanPromise = workoutApi.updatePlan(id!, {
				name: trimmedPlanName,
				coverImageUrl,
				coverExerciseId,
			})

			// 2. Update all active workouts names and weekDays in parallel
			const workoutPromises = activeDays.map((day) => {
				const existingWorkout = plan?.workouts?.find((w: WorkoutDTO) => w.day === day)
				const wName = (workoutNames[day] || `Treino ${day}`).trim()
				const wWeekDay = workoutWeekDays[day] || null
				if (existingWorkout) {
					return workoutApi.updateWorkout(existingWorkout.id, { name: wName, weekDay: wWeekDay })
				} else {
					return workoutApi.createWorkout(id!, { name: wName, day, weekDay: wWeekDay })
				}
			})

			// 3. Delete any existing workouts that are outside the selected division
			const removedWorkouts = (plan?.workouts || []).filter((w: WorkoutDTO) => !activeDays.includes(w.day))
			const deletePromises = removedWorkouts.map((w: WorkoutDTO) => workoutApi.deleteWorkout(w.id))

			await Promise.all([patchPlanPromise, ...workoutPromises, ...deletePromises])
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.plans })
			queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.planDetail(id) })
			goBack('/workout/plans')
		},
	})

	// Mutation: Add Exercise to Workout
	const addExerciseMutation = useMutation({
		mutationFn: async ({ day, exerciseId }: { day: string; exerciseId: string }) => {
			let workout = plan?.workouts?.find((w: WorkoutDTO) => w.day === day)

			// If workout doesn't exist yet, create it first
			if (!workout) {
				workout = await workoutApi.createWorkout(id!, {
					name: workoutNames[day] || `Treino ${day}`,
					day,
				})
			}

			if (!workout) return

			// Add the exercise
			const orderIndex = workout.workoutExercises?.length || 0
			const newExercise = await workoutApi.addExerciseToWorkout(workout.id, {
				exerciseId,
				orderIndex,
			})

			// Create 3 default sets
			for (let i = 1; i <= 3; i++) {
				await workoutApi.addSet(newExercise.id, {
					setNumber: i,
					repetitions: 10,
					weight: 0,
					restTimeSeconds: 60,
				})
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.planDetail(id) })
			setExerciseModalOpen(false)
		},
	})

	// Mutation: Delete Exercise
	const deleteExerciseMutation = useMutation({
		mutationFn: (workoutExerciseId: string) => workoutApi.deleteWorkoutExercise(workoutExerciseId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.planDetail(id) })
		},
	})

	// Mutation: Update Sets atomically via PUT replace-all endpoint
	const updateSetsMutation = useMutation({
		mutationFn: async () => {
			if (!editingWorkoutExerciseId) return

			await workoutApi.replaceSets(
				editingWorkoutExerciseId,
				editingSets.map((set) => ({
					repetitions: set.repetitions,
					weight: set.weight ?? 0,
					restTimeSeconds: set.restTimeSeconds,
				}))
			)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.planDetail(id) })
			setSetsModalOpen(false)
			setEditingWorkoutExerciseId(null)
		},
	})

	const handleOpenSetsModal = (workoutExercise: WorkoutExerciseDTO) => {
		setEditingWorkoutExerciseId(workoutExercise.id)
		const sets =
			workoutExercise.sets?.map((s: SetDTO) => ({
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
	const filteredCatalog = useMemo(() => {
		const term = exerciseSearch.trim().toLowerCase()
		return catalog.filter((ex) => {
			const matchesSearch =
				!term ||
				ex.name.toLowerCase().includes(term) ||
				ex.primaryMuscles.some((m) => m.toLowerCase().includes(term)) ||
				ex.category.toLowerCase().includes(term)

			const matchesCategory = !selectedCategory || ex.category.toLowerCase() === selectedCategory.toLowerCase()
			const matchesMuscle =
				!selectedMuscle || ex.primaryMuscles.some((m) => m.toLowerCase() === selectedMuscle.toLowerCase())

			return matchesSearch && matchesCategory && matchesMuscle
		})
	}, [catalog, exerciseSearch, selectedCategory, selectedMuscle])

	const activeDays = DIVISION_DAYS[selectedDivision]

	if (isLoading || !plan) {
		return (
			<MainLayout title="Editar Ficha" onBack={() => goBack('/workout/plans')}>
				<Center style={{ height: '70vh' }}>
					<Loader size="lg" />
				</Center>
			</MainLayout>
		)
	}

	return (
		<MainLayout title="Editar Ficha" onBack={() => goBack('/workout/plans')}>
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
												onChange={(e) =>
													setWorkoutNames({ ...workoutNames, [day]: e.currentTarget.value })
												}
												variant="unstyled"
												style={{
													textAlign: 'right',
													fontWeight: 600,
													borderBottom: '1px dashed var(--mantine-color-dark-4)',
												}}
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
													const exerciseImageUrl = getExerciseImageUrl(imagePath, true)

													const totalSets = we.sets?.length || 0
													const reps = we.sets?.[0]?.repetitions || 10
													const rest = we.sets?.[0]?.restTimeSeconds || 60

													return (
														<Card
															key={we.id}
															withBorder
															p="md"
															radius="sm"
															style={{
																cursor: 'pointer',
																backgroundColor: 'var(--mantine-color-dark-6)',
															}}
															onClick={() => handleOpenSetsModal(we)}
														>
															<Group justify="space-between" wrap="nowrap">
																<Group
																	gap="md"
																	wrap="nowrap"
																	style={{ flex: 1, minWidth: 0 }}
																>
																	<div
																		style={{
																			width: '80px',
																			height: '80px',
																			flexShrink: 0,
																			overflow: 'hidden',
																			borderRadius: '6px',
																		}}
																	>
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
																			{totalSets} séries x {reps} reps ({rest}s
																			desc.)
																		</Text>
																	</Stack>
																</Group>
																<Group gap="xs">
																	<ActionIcon
																		variant="subtle"
																		color={
																			coverExerciseId === we.exercise?.id
																				? 'yellow'
																				: 'gray'
																		}
																		size="sm"
																		onClick={(e) => {
																			e.stopPropagation()
																			if (coverExerciseId === we.exercise?.id) {
																				setCoverExerciseId(null)
																				setCoverImageUrl(null)
																			} else {
																				setCoverExerciseId(
																					we.exercise?.id || null
																				)
																				setCoverImageUrl(
																					we.exercise?.images?.[0] || null
																				)
																			}
																		}}
																		title={
																			coverExerciseId === we.exercise?.id
																				? 'Remover foto de capa'
																				: 'Definir como foto de capa'
																		}
																	>
																		<Star
																			size={15}
																			fill={
																				coverExerciseId === we.exercise?.id
																					? 'currentColor'
																					: 'none'
																			}
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
												<Text
													size="xs"
													c="dimmed"
													style={{ textAlign: 'center', padding: '10px 0' }}
												>
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
					<ModalExerciseSearchInput onDebouncedChange={setExerciseSearch} />

					{/* Dropdown Filters dynamically synchronized */}
					<SimpleGrid cols={2} spacing="xs">
						<Select
							placeholder="Músculo Foco"
							data={MUSCLE_OPTIONS}
							value={selectedMuscle}
							onChange={(val) => setSelectedMuscle(val)}
							clearable
							radius="md"
						/>
						<Select
							placeholder="Categoria"
							data={CATEGORY_OPTIONS}
							value={selectedCategory}
							onChange={(val) => setSelectedCategory(val)}
							clearable
							radius="md"
						/>
					</SimpleGrid>

					<Stack gap="xs">
						{filteredCatalog.slice(0, 15).map((ex) => {
							const imagePath = ex.images?.[0]
							const exerciseImageUrl = getExerciseImageUrl(imagePath, true)

							return (
								<Card
									key={ex.id}
									withBorder
									p="sm"
									radius="sm"
									style={{ cursor: 'pointer' }}
									onClick={() =>
										targetDayForExercise &&
										addExerciseMutation.mutate({ day: targetDayForExercise, exerciseId: ex.id })
									}
								>
									<Group gap="md" wrap="nowrap" align="center">
										<div
											style={{
												width: '70px',
												height: '70px',
												flexShrink: 0,
												overflow: 'hidden',
												borderRadius: '6px',
											}}
										>
											<Image src={exerciseImageUrl} w={70} h={70} fit="cover" loading="lazy" />
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
													width: 'fit-content',
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
											onChange={(val) =>
												handleUpdateSetField(index, 'repetitions', Number(val) || 10)
											}
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
											onChange={(val) =>
												handleUpdateSetField(index, 'restTimeSeconds', Number(val) || 60)
											}
											size="xs"
										/>
									</SimpleGrid>
								</Stack>
							</Paper>
						))}
					</Stack>

					<Button variant="outline" color="blue" size="xs" onClick={handleAddSet}>
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
