import { useState } from 'react'
import {
	Container,
	Stack,
	Button,
	Modal,
	TextInput,
	Center,
	Loader,
	Group,
	Paper,
	Text,
	NumberInput,
} from '@mantine/core'
import { PlusCircle, Trash2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDisclosure } from '@mantine/hooks'
import { MainLayout } from '../../../components/layout/MainLayout'
import { api } from '../../../api/axiosInstance'
import { NutritionLogic, type DietDTO, type DietLogDTO, type MealLogDTO, type MealDTO } from '@ate-a-falha/shared'
import { CalendarSelector } from '../../../components/CalendarSelector'
import { WaterCard } from '../components/WaterCard'
import { MacrosSummaryCard } from '../components/MacrosSummaryCard'
import { MealCard } from '../components/MealCard'
import { modals } from '@mantine/modals'
import { useNavigate } from 'react-router-dom'

export function DietLogPage() {
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const [selectedDate, setSelectedDate] = useState<Date>(new Date())
	const [opened, { open, close }] = useDisclosure(false)
	const [mealName, setMealName] = useState('')
	const [mealTime, setMealTime] = useState('12:00')
	const [waterGoalOpened, { open: openWaterGoal, close: closeWaterGoal }] = useDisclosure(false)
	const [newWaterGoal, setNewWaterGoal] = useState(3000)

	// States for editing a meal
	const [editingMeal, setEditingMeal] = useState<MealLogDTO | null>(null)
	const [editMealName, setEditMealName] = useState('')
	const [editMealTime, setEditMealTime] = useState('12:00')

	// Format date to local YYYY-MM-DD
	const formatDateString = (d: Date) => {
		const year = d.getFullYear()
		const month = String(d.getMonth() + 1).padStart(2, '0')
		const day = String(d.getDate()).padStart(2, '0')
		return `${year}-${month}-${day}`
	}

	const selectedDateStr = formatDateString(selectedDate)

	// Fetch active diet plans
	const { data: diets = [], isLoading: isLoadingDiets } = useQuery<DietDTO[]>({
		queryKey: ['diets'],
		queryFn: async () => {
			const res = await api.get('/nutrition/diets')
			return res.data
		},
	})

	// Fetch all daily diet logs
	const { data: dietLogs = [], isLoading: isLoadingLogs } = useQuery<DietLogDTO[]>({
		queryKey: ['diet-logs'],
		queryFn: async () => {
			const res = await api.get('/nutrition/diet-logs')
			return res.data
		},
	})

	const activeDiet = diets[0]

	// Find diet log for the selected date
	const activeLog = dietLogs.find((log) => {
		const rawDate = log.date as unknown as string | Date
		const logDateStr = typeof rawDate === 'string' ? rawDate.slice(0, 10) : formatDateString(rawDate)
		return logDateStr === selectedDateStr
	})

	// Mutation: Create a Diet Log entry
	const createDietLogMutation = useMutation({
		mutationFn: async (dateStr: string) => {
			const res = await api.post('/nutrition/diet-logs', { date: dateStr })
			return res.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['diet-logs'] })
		},
	})

	// Mutation: Update active diet (general patch)
	const updateDietMutation = useMutation({
		mutationFn: async ({ id, data }: { id: string; data: Partial<DietDTO> }) => {
			const res = await api.patch(`/nutrition/diets/${id}`, data)
			return res.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['diets'] })
		},
	})

	// Mutation: Add a Meal Log to a Diet Log
	const addMealLogMutation = useMutation({
		mutationFn: async ({ dietLogId, name, time }: { dietLogId: string; name: string; time: string }) => {
			const res = await api.post(`/nutrition/diet-logs/${dietLogId}/meals`, {
				name,
				time,
				orderIndex: activeLog?.meals?.length || 0,
			})
			return res.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['diet-logs'] })
			close()
			setMealName('')
			setMealTime('12:00')
		},
	})

	// Mutation: Update a Meal Log
	const updateMealLogMutation = useMutation({
		mutationFn: async ({ id, name, time }: { id: string; name: string; time: string }) => {
			const res = await api.patch(`/nutrition/meal-logs/${id}`, { name, time })
			return res.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['diet-logs'] })
			setEditingMeal(null)
		},
	})

	// Mutation: Delete a Meal Log
	const deleteMealLogMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api.delete(`/nutrition/meal-logs/${id}`)
			return res.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['diet-logs'] })
			setEditingMeal(null)
		},
	})

	const handleAddMeal = async () => {
		if (!mealName.trim()) return

		if (activeLog) {
			addMealLogMutation.mutate({
				dietLogId: activeLog.id,
				name: mealName,
				time: mealTime,
			})
		} else {
			// Create diet log first, then add the meal
			const newLog = await createDietLogMutation.mutateAsync(selectedDateStr)
			addMealLogMutation.mutate({
				dietLogId: newLog.id,
				name: mealName,
				time: mealTime,
			})
		}
	}

	const handleOpenEditModal = (meal: MealLogDTO) => {
		setEditingMeal(meal)
		setEditMealName(meal.name)
		setEditMealTime(meal.time)
	}

	const handleUpdateMeal = () => {
		if (!editingMeal || !editMealName.trim()) return
		updateMealLogMutation.mutate({
			id: editingMeal.id,
			name: editMealName,
			time: editMealTime,
		})
	}

	const handleDeleteMeal = () => {
		if (!editingMeal) return
		modals.openConfirmModal({
			title: 'Excluir Refeição',
			centered: true,
			children: (
				<Text size="sm">Tem certeza que deseja excluir esta refeição? Esta ação não pode ser desfeita.</Text>
			),
			labels: { confirm: 'Excluir', cancel: 'Cancelar' },
			confirmProps: { color: 'red' },
			onConfirm: () => deleteMealLogMutation.mutate(editingMeal.id),
		})
	}

	const handleUpdateWater = (amount: number) => {
		if (!activeDiet) return
		const newWater = Math.max(0, activeDiet.dailyWater + amount)
		updateDietMutation.mutate({ id: activeDiet.id, data: { dailyWater: newWater } })
	}

	const handleOpenWaterGoalModal = () => {
		setNewWaterGoal(targets.water)
		openWaterGoal()
	}

	const handleSaveWaterGoal = async () => {
		const payload = {
			name: 'Minha Dieta',
			dailyKcalGoal: targets.kcal,
			dailyProteinGoal: targets.protein,
			dailyCarbGoal: targets.carb,
			dailyFatGoal: targets.fat,
			dailyWaterGoal: newWaterGoal,
			dailyWater: targets.waterCurrent,
		}
		if (activeDiet) {
			await updateDietMutation.mutateAsync({
				id: activeDiet.id,
				data: { dailyWaterGoal: newWaterGoal },
			})
		} else {
			await api.post('/nutrition/diets', payload)
			queryClient.invalidateQueries({ queryKey: ['diets'] })
		}
		closeWaterGoal()
	}

	// Generate surrounding 7 days for the calendar day selector
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

	const weekDays = getWeekDays()

	// Calculate current daily macro totals from logged meals
	const loggedMeals = activeLog?.meals || []
	const dietTotals = NutritionLogic.calculateDietMacros(
		loggedMeals.map((meal: MealLogDTO) => ({
			...meal,
			foodsInMeal: meal.foods || [],
		})) as unknown as MealDTO[]
	)

	// Fallback/Default targets if no active diet is registered
	const targets = {
		kcal: activeDiet?.dailyKcalGoal || 2000,
		protein: activeDiet?.dailyProteinGoal || 150,
		carb: activeDiet?.dailyCarbGoal || 200,
		fat: activeDiet?.dailyFatGoal || 60,
		water: activeDiet?.dailyWaterGoal || 4000,
		waterCurrent: activeDiet?.dailyWater || 0,
	}

	if (isLoadingDiets || isLoadingLogs) {
		return (
			<MainLayout showSearch={false}>
				<Center style={{ height: '70vh' }}>
					<Loader size="lg" />
				</Center>
			</MainLayout>
		)
	}

	return (
		<MainLayout showSearch={false}>
			<Container size="xs" px={0}>
				<Stack gap="md">
					{/* Calendar Day Selector */}
					<CalendarSelector
						weekDays={weekDays}
						selectedDateStr={selectedDateStr}
						onSelectDate={setSelectedDate}
						formatDateString={formatDateString}
					/>

					{/* Water Intake Card */}
					<WaterCard
						waterCurrent={targets.waterCurrent}
						waterTarget={targets.water}
						onUpdateWater={handleUpdateWater}
						isPending={updateDietMutation.isPending}
						onEditTargetClick={handleOpenWaterGoalModal}
					/>

					{/* Daily Summary (Calories & Macros) */}
					<MacrosSummaryCard
						calories={dietTotals.calories}
						kcalTarget={targets.kcal}
						protein={dietTotals.proteins}
						proteinTarget={targets.protein}
						carb={dietTotals.carbohydrates}
						carbTarget={targets.carb}
						fat={dietTotals.fats}
						fatTarget={targets.fat}
						fiber={dietTotals.fiber}
						fiberTarget={25}
						onEditClick={() => navigate('/nutrition/goals')}
					/>

					{/* Meal Logs List */}
					{loggedMeals.length > 0 ? (
						loggedMeals.map((meal: MealLogDTO, idx: number) => (
							<MealCard key={idx} meal={meal} onEditClick={handleOpenEditModal} />
						))
					) : (
						<Paper withBorder p="xl" radius="md" shadow="sm" style={{ textAlign: 'center' }}>
							<Text c="dimmed" size="sm">
								Nenhuma refeição registrada para hoje.
							</Text>
						</Paper>
					)}

					{/* Action Button: Add Meal */}
					<Button
						leftSection={<PlusCircle size={20} />}
						size="md"
						radius="md"
						onClick={open}
						fullWidth
						mt="md"
					>
						Adicionar Refeição
					</Button>
				</Stack>
			</Container>

			{/* Modal to Add Meal Log */}
			<Modal opened={opened} onClose={close} title="Adicionar Refeição" centered radius="md">
				<Stack gap="md">
					<TextInput
						label="Nome da Refeição"
						placeholder="Ex: Café da Manhã, Almoço"
						required
						value={mealName}
						onChange={(e) => setMealName(e.currentTarget.value)}
					/>
					<TextInput
						label="Horário"
						placeholder="Ex: 08:00, 12:00"
						required
						value={mealTime}
						onChange={(e) => setMealTime(e.currentTarget.value)}
					/>
					<Button
						onClick={handleAddMeal}
						loading={createDietLogMutation.isPending || addMealLogMutation.isPending}
						fullWidth
						mt="xs"
					>
						Adicionar
					</Button>
				</Stack>
			</Modal>

			{/* Modal to Edit/Delete Meal Log */}
			<Modal
				opened={editingMeal !== null}
				onClose={() => setEditingMeal(null)}
				title="Editar Refeição"
				centered
				radius="md"
			>
				<Stack gap="md">
					<TextInput
						label="Nome da Refeição"
						placeholder="Ex: Café da Manhã, Almoço"
						required
						value={editMealName}
						onChange={(e) => setEditMealName(e.currentTarget.value)}
					/>
					<TextInput
						label="Horário"
						placeholder="Ex: 08:00, 12:00"
						required
						value={editMealTime}
						onChange={(e) => setEditMealTime(e.currentTarget.value)}
					/>
					<Group grow gap="sm" mt="xs">
						<Button
							color="red"
							variant="outline"
							leftSection={<Trash2 size={16} />}
							onClick={handleDeleteMeal}
							loading={deleteMealLogMutation.isPending}
						>
							Excluir
						</Button>
						<Button onClick={handleUpdateMeal} loading={updateMealLogMutation.isPending}>
							Salvar
						</Button>
					</Group>
				</Stack>
			</Modal>

			{/* Modal to Edit Water Goal */}
			<Modal opened={waterGoalOpened} onClose={closeWaterGoal} title="Editar Meta de Água" centered radius="md">
				<Stack gap="md">
					<NumberInput
						label="Nova Meta de Água (ml)"
						placeholder="Ex: 3000, 4000"
						required
						min={100}
						step={100}
						value={newWaterGoal}
						onChange={(val) => setNewWaterGoal(Number(val) || 0)}
					/>
					<Button onClick={handleSaveWaterGoal} loading={updateDietMutation.isPending} fullWidth mt="xs">
						Salvar
					</Button>
				</Stack>
			</Modal>
		</MainLayout>
	)
}
