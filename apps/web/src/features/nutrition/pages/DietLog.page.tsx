import { useState } from 'react'
import {
	Container,
	Stack,
	Button,
	Modal,
	TextInput,
	Center,
	Loader,
	Paper,
	Text,
	NumberInput,
	ActionIcon,
} from '@mantine/core'
import { PlusCircle, Search } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDisclosure } from '@mantine/hooks'
import { MainLayout } from '../../../components/layout/MainLayout'
import { NutritionLogic, type MealDTO, type MealLogDTO } from '@ate-a-falha/shared'
import { CalendarSelector } from '../../../components/CalendarSelector'
import { WaterCard } from '../components/WaterCard'
import { MacrosSummaryCard } from '../components/MacrosSummaryCard'
import { MealCard } from '../components/MealCard'
import { useNavigate } from 'react-router-dom'
import { nutritionApi } from '../api/nutritionApi'
import {
	NUTRITION_QUERY_KEYS,
	useDiets,
	useDietLogs,
	useTargetMeals,
	useCreateDiet,
	useUpdateDiet,
	useCreateDietLog,
	useUpdateDietLog,
	useCreateMealLog,
} from '../hooks/useNutrition'

export function DietLogPage() {
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const [selectedDate, setSelectedDate] = useState<Date>(new Date())
	const [opened, { open, close }] = useDisclosure(false)
	const [mealName, setMealName] = useState('')
	const [mealTime, setMealTime] = useState('12:00')
	const [waterGoalOpened, { open: openWaterGoal, close: closeWaterGoal }] = useDisclosure(false)
	const [newWaterGoal, setNewWaterGoal] = useState(3000)

	// Format date to local YYYY-MM-DD
	const formatDateString = (d: Date) => {
		const year = d.getFullYear()
		const month = String(d.getMonth() + 1).padStart(2, '0')
		const day = String(d.getDate()).padStart(2, '0')
		return `${year}-${month}-${day}`
	}

	const selectedDateStr = formatDateString(selectedDate)

	// Fetch active diet plans
	const { data: diets = [], isLoading: isLoadingDiets } = useDiets()

	// Fetch all daily diet logs
	const { data: dietLogs = [], isLoading: isLoadingLogs } = useDietLogs()

	const activeDiet = diets[0]

	// Fetch reference meals
	const { data: targetMeals = [], isLoading: isLoadingMeals } = useTargetMeals(activeDiet?.id)

	// Find diet log for the selected date
	const activeLog = dietLogs.find((log) => {
		const rawDate = log.date as unknown as string | Date
		const logDateStr = typeof rawDate === 'string' ? rawDate.slice(0, 10) : formatDateString(rawDate)
		return logDateStr === selectedDateStr
	})

	// Calculate current daily macro totals from logged meals
	const loggedMeals = [...(activeLog?.meals || [])].sort((a, b) => a.time.localeCompare(b.time))
	const dietTotals = NutritionLogic.calculateDietMacros(loggedMeals)

	// Mutations via feature hooks
	const createDietMutation = useCreateDiet()
	const createDietLogMutation = useCreateDietLog()
	const updateDietMutation = useUpdateDiet()
	const updateDietLogMutation = useUpdateDietLog()
	const createMealLogMutation = useCreateMealLog()

	const addMealLogMutation = {
		isPending: createMealLogMutation.isPending,
		mutate: ({ dietLogId, name, time }: { dietLogId: string; name: string; time: string }) => {
			createMealLogMutation.mutate(
				{
					dietLogId,
					name,
					time,
					orderIndex: activeLog?.meals?.length || 0,
				},
				{
					onSuccess: () => {
						close()
						setMealName('')
						setMealTime('12:00')
					},
				}
			)
		},
	}

	const isCurrentOrFuture = (() => {
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const currentSelected = new Date(selectedDateStr + 'T00:00:00')
		return currentSelected >= today
	})()

	const [togglingMealId, setTogglingMealId] = useState<string | null>(null)

	const toggleReferenceMealMutation = useMutation({
		mutationFn: async ({
			targetMeal,
			isLogged,
			loggedMealId,
		}: {
			targetMeal: MealDTO
			isLogged: boolean
			loggedMealId?: string
		}) => {
			setTogglingMealId(targetMeal.id)
			if (isLogged && loggedMealId) {
				await nutritionApi.deleteMealLog(loggedMealId)
			} else {
				let dietLogId = activeLog?.id
				if (!dietLogId) {
					const newLog = await nutritionApi.createDietLog(selectedDateStr)
					dietLogId = newLog.id
				}

				const foodsToLog = (targetMeal.foods || []).map((f) => ({
					foodId: f.foodId,
					quantity: f.quantity,
				}))

				await nutritionApi.createMealLog(dietLogId, {
					name: targetMeal.name,
					time: targetMeal.time,
					orderIndex: activeLog?.meals?.length || 0,
					foods: foodsToLog,
				})
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.dietLogs })
		},
		onSettled: () => {
			setTogglingMealId(null)
		},
	})

	const getMergedMeals = () => {
		const targetMealsArr = targetMeals || []
		const loggedMealsArr = loggedMeals || []
		if (!isCurrentOrFuture || targetMealsArr.length === 0) {
			return loggedMealsArr.map((meal) => ({
				key: `logged-${meal.id}`,
				meal,
				isTemplate: false,
				isLogged: false,
				onToggle: undefined,
				isToggling: false,
			}))
		}

		const matchedLoggedIds = new Set<string>()

		const merged = targetMealsArr
			.map((target) => {
				if (!target) return null
				const match = loggedMealsArr.find(
					(l) =>
						l &&
						(l.name || '').toLowerCase() === (target.name || '').toLowerCase() &&
						!matchedLoggedIds.has(l.id)
				)

				if (match) {
					matchedLoggedIds.add(match.id)
					return {
						key: `target-logged-${target.id}`,
						meal: match,
						isTemplate: false,
						isLogged: true,
						onToggle: () =>
							toggleReferenceMealMutation.mutate({
								targetMeal: target,
								isLogged: true,
								loggedMealId: match.id,
							}),
						isToggling: togglingMealId === target.id,
					}
				} else {
					return {
						key: `target-template-${target.id}`,
						meal: target as unknown as MealLogDTO,
						isTemplate: true,
						isLogged: false,
						onToggle: () =>
							toggleReferenceMealMutation.mutate({
								targetMeal: target,
								isLogged: false,
							}),
						isToggling: togglingMealId === target.id,
					}
				}
			})
			.filter((item): item is NonNullable<typeof item> => Boolean(item))

		const remaining = loggedMealsArr
			.filter((l) => l && !matchedLoggedIds.has(l.id))
			.map((meal) => ({
				key: `logged-${meal.id}`,
				meal,
				isTemplate: false,
				isLogged: false,
				onToggle: undefined,
				isToggling: false,
			}))

		return [...merged, ...remaining]
	}

	const displayMeals = getMergedMeals()

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

	const handleUpdateWater = async (amount: number) => {
		const currentWater = activeLog?.waterIntake || 0
		const newWater = Math.max(0, currentWater + amount)

		if (activeLog) {
			updateDietLogMutation.mutate({
				id: activeLog.id,
				data: { waterIntake: newWater },
			})
		} else {
			const newLog = await createDietLogMutation.mutateAsync(selectedDateStr)
			updateDietLogMutation.mutate({
				id: newLog.id,
				data: { waterIntake: newWater },
			})
		}
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
			dailyFiberGoal: targets.fiber,
			dailyWaterGoal: newWaterGoal,
			dailyWater: targets.waterCurrent,
		}
		if (activeDiet) {
			await updateDietMutation.mutateAsync({
				id: activeDiet.id,
				data: { dailyWaterGoal: newWaterGoal },
			})
		} else {
			await createDietMutation.mutateAsync(payload)
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

	// Fallback/Default targets if no active diet is registered
	const targets = {
		kcal: activeDiet?.dailyKcalGoal || 2000,
		protein: activeDiet?.dailyProteinGoal || 150,
		carb: activeDiet?.dailyCarbGoal || 200,
		fat: activeDiet?.dailyFatGoal || 60,
		fiber: activeDiet?.dailyFiberGoal || 25,
		water: activeDiet?.dailyWaterGoal || 4000,
		waterCurrent: activeLog?.waterIntake || 0,
	}

	if (isLoadingDiets || isLoadingLogs || (!!activeDiet && isLoadingMeals)) {
		return (
			<MainLayout title="Dieta">
				<Center style={{ height: '70vh' }}>
					<Loader size="lg" />
				</Center>
			</MainLayout>
		)
	}

	return (
		<MainLayout
			title="Dieta"
			actions={
				<ActionIcon variant="subtle" color="gray" onClick={() => navigate('/nutrition/search')}>
					<Search size={20} />
				</ActionIcon>
			}
		>
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
						isPending={updateDietLogMutation.isPending || createDietLogMutation.isPending}
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
						fiberTarget={targets.fiber}
						onEditClick={() => navigate('/nutrition/goals')}
					/>

					{/* Meal Logs List */}
					{displayMeals.length > 0 ? (
						displayMeals.map((item) => (
							<MealCard
								key={item.key}
								meal={item.meal}
								isTemplate={item.isTemplate}
								isLogged={item.isLogged}
								onToggle={item.onToggle}
								isToggling={item.isToggling}
							/>
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
