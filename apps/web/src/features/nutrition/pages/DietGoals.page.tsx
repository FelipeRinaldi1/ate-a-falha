import { useState } from 'react'
import {
	Container,
	Paper,
	Stack,
	Group,
	Text,
	Button,
	Modal,
	NumberInput,
	Center,
	Loader,
	SimpleGrid,
	Card,
	TextInput,
	ActionIcon,
	Progress,
	Divider,
} from '@mantine/core'
import { Pencil, PlusCircle, Trash2, Share2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { modals } from '@mantine/modals'
import { MainLayout } from '../../../components/layout/MainLayout'
import { api } from '../../../api/axiosInstance'
import { ShareModal } from '../../../components/ShareModal'
import { type DietDTO, type MealDTO, type FoodInMealDTO, NutritionLogic } from '@ate-a-falha/shared'
import { DonutChart } from '@mantine/charts'

interface BodyMetric {
	id: string
	weight: number
	height: number
	activityLevel: number
	bodyFat: number | null
	muscleRate: number | null
	createdAt: string
}

export function DietGoalsPage() {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const [opened, setOpened] = useState(false)
	const [shareModalOpen, setShareModalOpen] = useState(false)

	// Fetch active diet plans
	const { data: diets = [], isLoading: isLoadingDiets } = useQuery<DietDTO[]>({
		queryKey: ['diets'],
		queryFn: async () => {
			const res = await api.get('/nutrition/diets')
			return res.data
		},
	})

	// Fetch body metrics to get user weight
	const { data: bodyMetrics = [], isLoading: isLoadingMetrics } = useQuery<BodyMetric[]>({
		queryKey: ['body-metrics'],
		queryFn: async () => {
			const res = await api.get('/users/body-metrics')
			return res.data
		},
	})

	const activeDiet = diets[0]
	const latestMetric = bodyMetrics[0]
	const weight = latestMetric?.weight || 0

	// Local state for editing form
	const [proteinGPerKg, setProteinGPerKg] = useState<number>(2.0)
	const [fatGPerKg, setFatGPerKg] = useState<number>(1.0)
	const [carbGPerKg, setCarbGPerKg] = useState<number>(5.0)
	const [fiberGoal, setFiberGoal] = useState<number>(25)

	const handleOpenEditModal = () => {
		if (activeDiet && weight > 0) {
			setProteinGPerKg(Number((activeDiet.dailyProteinGoal / weight).toFixed(1)))
			setFatGPerKg(Number((activeDiet.dailyFatGoal / weight).toFixed(1)))
			setCarbGPerKg(Number((activeDiet.dailyCarbGoal / weight).toFixed(1)))
			setFiberGoal(activeDiet.dailyFiberGoal || 25)
		} else {
			setProteinGPerKg(2.0)
			setFatGPerKg(1.0)
			setCarbGPerKg(5.0)
			setFiberGoal(25)
		}
		setOpened(true)
	}

	// Calculate dynamic goals based on input
	const calculatedProtein = Number((proteinGPerKg * weight).toFixed(0))
	const calculatedFat = Number((fatGPerKg * weight).toFixed(0))
	const calculatedCarb = Number((carbGPerKg * weight).toFixed(0))
	const calculatedKcal = calculatedProtein * 4 + calculatedCarb * 4 + calculatedFat * 9

	// Mutation: Save Diet Goals (Create or Update)
	const saveDietGoalsMutation = useMutation({
		mutationFn: async () => {
			const payload = {
				name: activeDiet?.name || 'Minha Dieta',
				dailyKcalGoal: calculatedKcal,
				dailyProteinGoal: calculatedProtein,
				dailyCarbGoal: calculatedCarb,
				dailyFatGoal: calculatedFat,
				dailyFiberGoal: fiberGoal,
				dailyWaterGoal: activeDiet?.dailyWaterGoal || 3000,
				dailyWater: activeDiet?.dailyWater || 0,
			}

			if (activeDiet) {
				const res = await api.patch(`/nutrition/diets/${activeDiet.id}`, payload)
				return res.data
			} else {
				const res = await api.post('/nutrition/diets', payload)
				return res.data
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['diets'] })
			setOpened(false)
		},
	})

	// Mutation: Toggle isExported diet
	const toggleDietExportMutation = useMutation({
		mutationFn: async ({ id, isExported }: { id: string; isExported: boolean }) => {
			return api.patch(`/nutrition/diets/${id}`, { isExported })
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['diets'] })
		},
	})

	// Reference Meals Query and States
	const { data: targetMeals = [], isLoading: isLoadingMeals } = useQuery<MealDTO[]>({
		queryKey: ['target-meals', activeDiet?.id],
		queryFn: async () => {
			const res = await api.get(`/nutrition/diets/${activeDiet.id}/meals`)
			return res.data
		},
		enabled: !!activeDiet?.id,
	})



	const [newMealOpened, setNewMealOpened] = useState(false)
	const [newMealName, setNewMealName] = useState('')
	const [newMealTime, setNewMealTime] = useState('08:00')

	const [editingMeal, setEditingMeal] = useState<MealDTO | null>(null)
	const [editMealName, setEditMealName] = useState('')
	const [editMealTime, setEditMealTime] = useState('08:00')

	const [editingFood, setEditingFood] = useState<FoodInMealDTO | null>(null)
	const [editFoodQuantity, setEditFoodQuantity] = useState(100)

	// Mutations for Reference Meals
	const addMealMutation = useMutation({
		mutationFn: async () => {
			if (!activeDiet) return
			const orderIndex = targetMeals.length
			return api.post(`/nutrition/diets/${activeDiet.id}/meals`, {
				name: newMealName,
				time: newMealTime,
				orderIndex,
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['target-meals', activeDiet?.id] })
			setNewMealName('')
			setNewMealTime('08:00')
			setNewMealOpened(false)
		},
	})

	const updateMealMutation = useMutation({
		mutationFn: async () => {
			if (!editingMeal) return
			return api.patch(`/nutrition/meals/${editingMeal.id}`, {
				name: editMealName,
				time: editMealTime,
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['target-meals', activeDiet?.id] })
			setEditingMeal(null)
		},
	})

	const deleteMealMutation = useMutation({
		mutationFn: async (mealId: string) => {
			return api.delete(`/nutrition/meals/${mealId}`)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['target-meals', activeDiet?.id] })
		},
	})

	// Mutations for Reference Foods
	const removeFoodMutation = useMutation({
		mutationFn: async (foodInMealId: string) => {
			return api.delete(`/nutrition/food-in-meals/${foodInMealId}`)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['target-meals', activeDiet?.id] })
		},
	})

	const updateFoodPortionMutation = useMutation({
		mutationFn: async ({ foodInMealId, quantity }: { foodInMealId: string; quantity: number }) => {
			return api.patch(`/nutrition/food-in-meals/${foodInMealId}`, { quantity })
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['target-meals', activeDiet?.id] })
			setEditingFood(null)
		},
	})

	const handleDeleteMealConfirm = (meal: MealDTO) => {
		modals.openConfirmModal({
			title: 'Excluir Refeição de Referência',
			centered: true,
			children: (
				<Text size="sm">Tem certeza que deseja excluir a refeição "{meal.name}"? Todos os alimentos cadastrados nela serão removidos do planejamento.</Text>
			),
			labels: { confirm: 'Excluir', cancel: 'Cancelar' },
			confirmProps: { color: 'red' },
			onConfirm: () => deleteMealMutation.mutate(meal.id),
		})
	}

	const handleRemoveFoodConfirm = (foodInMealId: string, foodName: string) => {
		modals.openConfirmModal({
			title: 'Remover Alimento de Referência',
			centered: true,
			children: (
				<Text size="sm">
					Tem certeza que deseja remover o alimento <strong>{foodName}</strong> desta refeição?
				</Text>
			),
			labels: { confirm: 'Remover', cancel: 'Cancelar' },
			confirmProps: { color: 'red' },
			onConfirm: () => removeFoodMutation.mutate(foodInMealId),
		})
	}

	const handleOpenEditMeal = (meal: MealDTO) => {
		setEditMealName(meal.name)
		setEditMealTime(meal.time)
		setEditingMeal(meal)
	}

	const handleOpenEditFood = (fim: FoodInMealDTO) => {
		setEditFoodQuantity(fim.quantity)
		setEditingFood(fim)
	}

	if (isLoadingDiets || isLoadingMetrics || (!!activeDiet && isLoadingMeals)) {
		return (
			<MainLayout title="Meta Diária" onBack={() => navigate('/nutrition')}>
				<Center style={{ height: '70vh' }}>
					<Loader size="lg" />
				</Center>
			</MainLayout>
		)
	}

	// Targets
	const targetKcal = activeDiet?.dailyKcalGoal || 2000
	const targetProtein = activeDiet?.dailyProteinGoal || 150
	const targetFat = activeDiet?.dailyFatGoal || 60
	const targetCarb = activeDiet?.dailyCarbGoal || 200
	const targetFiber = activeDiet?.dailyFiberGoal || 25

	const plannedTotals = targetMeals.reduce(
		(acc, meal) => {
			const mealFoods = meal.foods || []
			const mealTotals = NutritionLogic.calculateMealMacros(
				mealFoods as unknown as Parameters<typeof NutritionLogic.calculateMealMacros>[0]
			)
			return {
				calories: acc.calories + mealTotals.calories,
				proteins: acc.proteins + mealTotals.proteins,
				carbohydrates: acc.carbohydrates + mealTotals.carbohydrates,
				fats: acc.fats + mealTotals.fats,
				fiber: acc.fiber + mealTotals.fiber,
			}
		},
		{ calories: 0, proteins: 0, carbohydrates: 0, fats: 0, fiber: 0 }
	)

	const getMacroWarning = (planned: number, target: number, label: string) => {
		const diff = planned - target
		if (Math.abs(diff) < 2) {
			return { text: `Meta de ${label} atingida! 🎉`, color: 'green' }
		} else if (diff < 0) {
			return { text: `Faltam planejar ${Math.abs(diff).toFixed(0)}g de ${label}`, color: 'blue' }
		} else {
			return { text: `Excedeu a meta de ${label} em ${diff.toFixed(0)}g! ⚠️`, color: 'orange' }
		}
	}

	const kcalPercent = targetKcal > 0 ? Math.min(Math.round((plannedTotals.calories / targetKcal) * 100), 100) : 0
	
	const kcalDiff = plannedTotals.calories - targetKcal
	const kcalWarningText = Math.abs(kcalDiff) < 15 
		? "Meta de Calorias atingida! 🎉"
		: kcalDiff < 0 
			? `Faltam planejar ${Math.abs(kcalDiff).toFixed(0)} Kcal`
			: `Excedeu a meta de calorias em ${kcalDiff.toFixed(0)} Kcal! ⚠️`
	const kcalWarningColor = Math.abs(kcalDiff) < 15 ? 'green' : kcalDiff < 0 ? 'blue' : 'orange'

	const pCalGoal = targetProtein * 4
	const cCalGoal = targetCarb * 4
	const fCalGoal = targetFat * 9
	const totalCalGoal = pCalGoal + cCalGoal + fCalGoal

	const protGoalPercent = totalCalGoal > 0 ? Math.round((pCalGoal / totalCalGoal) * 100) : 0
	const carbGoalPercent = totalCalGoal > 0 ? Math.round((cCalGoal / totalCalGoal) * 100) : 0
	const fatGoalPercent = totalCalGoal > 0 ? Math.round((fCalGoal / totalCalGoal) * 100) : 0

	return (
		<MainLayout title="Meta Diária" onBack={() => navigate('/nutrition')}>
			<Container size="xs" px={0}>
				<Stack gap="md">
					{weight === 0 ? (
						<Paper withBorder p="xl" radius="md" shadow="sm" style={{ textAlign: 'center' }}>
							<Stack align="center" gap="md">
								<Text fw={700} size="md">
									Nenhuma pesagem cadastrada
								</Text>
								<Text size="sm" c="dimmed">
									Você precisa cadastrar seu peso corporal no perfil para poder configurar e
									sincronizar suas metas diárias em g/kg.
								</Text>
								<Button onClick={() => navigate('/profile/new-metric')} fullWidth>
									Registrar Peso Corporal
								</Button>
							</Stack>
						</Paper>
					) : (
						<>
							{/* Daily Goals Container */}
							<Paper withBorder p="md" radius="md" shadow="sm" style={{ position: 'relative' }}>
								<Stack gap="md">
									<Group justify="space-between" align="center">
										<Text fw={700} c="dimmed" size="sm">
											Macronutrientes
										</Text>
										<Group gap="xs">
											{activeDiet && (
												<Button
													size="xs"
													variant="light"
													leftSection={<Share2 size={12} />}
													onClick={() => setShareModalOpen(true)}
												>
													Compartilhar
												</Button>
											)}
											<Button
												size="xs"
												variant="light"
												leftSection={<Pencil size={12} />}
												onClick={handleOpenEditModal}
											>
												Editar
											</Button>
										</Group>
									</Group>

									{/* Calories Goal Card */}
									<Card
										withBorder
										p="md"
										radius="md"
										style={{ backgroundColor: 'var(--mantine-color-dark-6)' }}
									>
										<Text size="xs" c="dimmed" fw={700}>
											Meta Diária de Calorias
										</Text>
										<Text size="xl" fw={800} mt={4}>
											{targetKcal} Kal
										</Text>
									</Card>

									{/* Macros detail */}
									<Stack gap="xs">
										<Card withBorder p="sm" radius="md">
											<Group justify="space-between" align="center">
												<Stack gap={0}>
													<Text fw={700} size="sm">
														Proteína
													</Text>
													<Text size="xs" c="dimmed">
														{targetProtein.toFixed(0)}g
													</Text>
												</Stack>
												<Stack gap={0} style={{ textAlign: 'right' }}>
													<Text fw={700} size="sm">
														{weight > 0 ? (targetProtein / weight).toFixed(1) : 0} g/kg
													</Text>
													<Text size="xs" c="dimmed">
														{(targetProtein * 4).toFixed(0)} Kal
													</Text>
												</Stack>
											</Group>
										</Card>

										<Card withBorder p="sm" radius="md">
											<Group justify="space-between" align="center">
												<Stack gap={0}>
													<Text fw={700} size="sm">
														Gordura
													</Text>
													<Text size="xs" c="dimmed">
														{targetFat.toFixed(0)}g
													</Text>
												</Stack>
												<Stack gap={0} style={{ textAlign: 'right' }}>
													<Text fw={700} size="sm">
														{weight > 0 ? (targetFat / weight).toFixed(1) : 0} g/kg
													</Text>
													<Text size="xs" c="dimmed">
														{(targetFat * 9).toFixed(0)} Kal
													</Text>
												</Stack>
											</Group>
										</Card>

										<Card withBorder p="sm" radius="md">
											<Group justify="space-between" align="center">
												<Stack gap={0}>
													<Text fw={700} size="sm">
														Carboidratos
													</Text>
													<Text size="xs" c="dimmed">
														{targetCarb.toFixed(0)}g
													</Text>
												</Stack>
												<Stack gap={0} style={{ textAlign: 'right' }}>
													<Text fw={700} size="sm">
														{weight > 0 ? (targetCarb / weight).toFixed(1) : 0} g/kg
													</Text>
													<Text size="xs" c="dimmed">
														{(targetCarb * 4).toFixed(0)} Kal
													</Text>
												</Stack>
											</Group>
										</Card>

										<Card withBorder p="sm" radius="md">
											<Group justify="space-between" align="center">
												<Stack gap={0}>
													<Text fw={700} size="sm">
														Fibras
													</Text>
													<Text size="xs" c="dimmed">
														{targetFiber.toFixed(0)}g
													</Text>
												</Stack>
												<Stack gap={0} style={{ textAlign: 'right' }}>
													<Text fw={700} size="sm">
														Meta diária
													</Text>
													<Text size="xs" c="dimmed">
														Sem valor calórico direto
													</Text>
												</Stack>
											</Group>
										</Card>
									</Stack>
								</Stack>
							</Paper>

							{/* Daily Goals Chart Container */}
							<Paper withBorder p="md" radius="md" shadow="sm">
								<Stack gap="md" align="center">
									<Group w="100%" justify="flex-start">
										<Text fw={700} c="dimmed" size="sm">
											Distribuição da Meta Diária (Macronutrientes)
										</Text>
									</Group>

									<DonutChart
										data={[
											{ name: 'Proteínas', value: pCalGoal, color: 'red' },
											{ name: 'Carboidratos', value: cCalGoal, color: 'yellow' },
											{ name: 'Gorduras', value: fCalGoal, color: 'green' },
										]}
										withTooltip={false}
										size={160}
										thickness={20}
									/>

									<SimpleGrid cols={3} spacing="xs" w="100%" mt="sm">
										<Card withBorder p="xs" radius="md" style={{ textAlign: 'center' }}>
											<Text size="xs" fw={700} c="red">
												Proteínas
											</Text>
											<Text size="sm" fw={700}>
												{protGoalPercent}%
											</Text>
											<Text size="xs" c="dimmed">
												{pCalGoal.toFixed(0)} Kal
											</Text>
										</Card>
										<Card withBorder p="xs" radius="md" style={{ textAlign: 'center' }}>
											<Text size="xs" fw={700} c="yellow">
												Carboidratos
											</Text>
											<Text size="sm" fw={700}>
												{carbGoalPercent}%
											</Text>
											<Text size="xs" c="dimmed">
												{cCalGoal.toFixed(0)} Kal
											</Text>
										</Card>
										<Card withBorder p="xs" radius="md" style={{ textAlign: 'center' }}>
											<Text size="xs" fw={700} c="green">
												Gorduras
											</Text>
											<Text size="sm" fw={700}>
												{fatGoalPercent}%
											</Text>
											<Text size="xs" c="dimmed">
												{fCalGoal.toFixed(0)} Kal
											</Text>
										</Card>
									</SimpleGrid>
								</Stack>
							</Paper>

							{/* Reference Meals (Planning) Section */}
							<Paper withBorder p="md" radius="md" shadow="sm">
								<Stack gap="md">
									<Group justify="space-between" align="center">
										<Text fw={700} c="dimmed" size="sm">
											Refeições de Referência (Planejamento)
										</Text>
										<Button
											size="xs"
											variant="light"
											leftSection={<PlusCircle size={14} />}
											onClick={() => setNewMealOpened(true)}
										>
											Nova Refeição
										</Button>
									</Group>

									{/* Progress and Validation Panel */}
									<Paper withBorder p="sm" radius="md" bg="var(--mantine-color-dark-8)">
										<Stack gap="xs">
											<Group justify="space-between" align="center">
												<Text fw={700} size="xs" c="dimmed">
													Calorias Planejadas vs. Meta
												</Text>
												<Text fw={800} size="sm" c={kcalWarningColor}>
													{plannedTotals.calories.toFixed(0)} / {targetKcal} Kcal ({kcalPercent}%)
												</Text>
											</Group>
											<Progress value={(plannedTotals.calories / targetKcal) * 100} color={kcalWarningColor} size="md" radius="xl" animated={kcalPercent < 100 && plannedTotals.calories > 0} />
											
											<Text size="xs" fw={700} c={kcalWarningColor}>
												{kcalWarningText}
											</Text>

											<Divider my={4} color="dark.4" />
											
											<Text fw={700} size="xs" c="dimmed">
												Validação de Macronutrientes
											</Text>

											<SimpleGrid cols={2} spacing="xs">
												{[
													{ ...getMacroWarning(plannedTotals.proteins, targetProtein, 'Proteína'), targetVal: targetProtein, plannedVal: plannedTotals.proteins },
													{ ...getMacroWarning(plannedTotals.carbohydrates, targetCarb, 'Carboidratos'), targetVal: targetCarb, plannedVal: plannedTotals.carbohydrates },
													{ ...getMacroWarning(plannedTotals.fats, targetFat, 'Gorduras'), targetVal: targetFat, plannedVal: plannedTotals.fats },
													{ ...getMacroWarning(plannedTotals.fiber, targetFiber, 'Fibras'), targetVal: targetFiber, plannedVal: plannedTotals.fiber },
												].map((warn, i) => (
													<Paper key={i} p="xs" radius="sm" bg="var(--mantine-color-dark-6)" style={{ borderLeft: `3px solid var(--mantine-color-${warn.color}-6)`, display: 'flex', flexDirection: 'column', gap: '2px' }}>
														<Text size="11px" fw={700} c={warn.color}>
															{warn.text}
														</Text>
														<Text size="9px" c="dimmed" fw={600}>
															Planejado: {warn.plannedVal.toFixed(0)}g / Meta: {warn.targetVal.toFixed(0)}g
														</Text>
													</Paper>
												))}
											</SimpleGrid>
										</Stack>
									</Paper>

									<Stack gap="sm">
										{targetMeals.length > 0 ? (
											targetMeals.map((meal: MealDTO) => {
												const mealFoods = meal.foods || []
												const mealTotals = NutritionLogic.calculateMealMacros(
													mealFoods as unknown as Parameters<typeof NutritionLogic.calculateMealMacros>[0]
												)

												return (
													<Card key={meal.id} withBorder p="sm" radius="md" bg="var(--mantine-color-dark-7)">
														<Stack gap="xs">
															<Group justify="space-between" align="center">
																<Group gap="xs" align="center">
																	<Text fw={800} size="sm">
																		{meal.name}
																	</Text>
																	<Text size="xs" c="dimmed">
																		({meal.time})
																	</Text>
																</Group>
																<Group gap="xs">
																	<Text size="xs" fw={700} c="dimmed">
																		{mealTotals.calories.toFixed(0)} Kcal
																	</Text>
																	<ActionIcon
																		variant="subtle"
																		color="gray"
																		size="sm"
																		onClick={() => handleOpenEditMeal(meal)}
																	>
																		<Pencil size={12} />
																	</ActionIcon>
																	<ActionIcon
																		variant="subtle"
																		color="red"
																		size="sm"
																		onClick={() => handleDeleteMealConfirm(meal)}
																	>
																		<Trash2 size={12} />
																	</ActionIcon>
																</Group>
															</Group>

															{/* Reference foods in this meal */}
															<Stack gap={4} mt={2}>
																{mealFoods.length > 0 ? (
																	mealFoods.map((fim: FoodInMealDTO) => (
																		<Group key={fim.id} justify="space-between" wrap="nowrap" style={{ borderBottom: '1px solid var(--mantine-color-dark-5)', paddingBottom: '4px' }}>
																			<Stack gap={0} style={{ flex: 1 }}>
																				<Text size="xs" fw={700}>
																					{fim.food.name}
																				</Text>
																				<Text size="10px" c="dimmed">
																					{fim.quantity}g • {((fim.food.protein * fim.quantity)/100).toFixed(0)}g P • {((fim.food.carbohydrate * fim.quantity)/100).toFixed(0)}g C • {((fim.food.lipids * fim.quantity)/100).toFixed(0)}g G
																				</Text>
																			</Stack>
																			<Group gap="xs" wrap="nowrap">
																				<ActionIcon
																					variant="subtle"
																					color="gray"
																					size="xs"
																					onClick={() => handleOpenEditFood(fim)}
																				>
																					<Pencil size={10} />
																				</ActionIcon>
																				<ActionIcon
																					variant="subtle"
																					color="red"
																					size="xs"
																					onClick={() => handleRemoveFoodConfirm(fim.id, fim.food.name)}
																				>
																					<Trash2 size={10} />
																				</ActionIcon>
																			</Group>
																		</Group>
																	))
																) : (
																	<Text size="xs" c="dimmed" style={{ textAlign: 'center', padding: '6px 0' }}>
																		Nenhum alimento de referência.
																	</Text>
																)}
															</Stack>

															<Button
																variant="light"
																color="gray"
																size="xs"
																fullWidth
																mt="xs"
																onClick={() => navigate(`/nutrition/search?mealId=${meal.id}`)}
															>
																+ Adicionar Alimento de Referência
															</Button>
														</Stack>
													</Card>
												)
											})
										) : (
											<Text size="xs" c="dimmed" style={{ textAlign: 'center', padding: '10px 0' }}>
												Nenhuma refeição planejada. Crie uma para começar a montar o seu plano alimentar de referência.
											</Text>
										)}
									</Stack>
								</Stack>
							</Paper>
						</>
					)}
				</Stack>
			</Container>

			{/* Edit Goals Modal */}
			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title="Configurar Metas de Macronutrientes"
				centered
				radius="md"
			>
				<Stack gap="md">
					<Text size="xs" c="dimmed">
						Abaixo, insira os valores multiplicadores (g/kg) de cada macronutriente com base no seu peso
						atual de <strong>{weight} kg</strong>.
					</Text>

					<NumberInput
						label="Proteína (g/kg)"
						placeholder="Ex: 2.0"
						min={0.1}
						step={0.1}
						decimalScale={1}
						required
						value={proteinGPerKg}
						onChange={(val) => setProteinGPerKg(Number(val) || 0)}
					/>

					<NumberInput
						label="Gordura (g/kg)"
						placeholder="Ex: 1.0"
						min={0.1}
						step={0.1}
						decimalScale={1}
						required
						value={fatGPerKg}
						onChange={(val) => setFatGPerKg(Number(val) || 0)}
					/>

					<NumberInput
						label="Carboidratos (g/kg)"
						placeholder="Ex: 5.0"
						min={0.1}
						step={0.1}
						decimalScale={1}
						required
						value={carbGPerKg}
						onChange={(val) => setCarbGPerKg(Number(val) || 0)}
					/>

					<NumberInput
						label="Fibras (g)"
						placeholder="Ex: 25"
						min={1}
						step={1}
						required
						value={fiberGoal}
						onChange={(val) => setFiberGoal(Number(val) || 0)}
					/>

					<Paper withBorder p="sm" radius="md" style={{ backgroundColor: 'var(--mantine-color-dark-6)' }}>
						<Stack gap="xs">
							<Text size="xs" fw={700} c="dimmed">
								Metas Calculadas
							</Text>
							<Group justify="space-between">
								<Text size="xs">Proteínas:</Text>
								<Text size="xs" fw={700}>
									{calculatedProtein}g ({calculatedProtein * 4} Kal)
								</Text>
							</Group>
							<Group justify="space-between">
								<Text size="xs">Gorduras:</Text>
								<Text size="xs" fw={700}>
									{calculatedFat}g ({calculatedFat * 9} Kal)
								</Text>
							</Group>
							<Group justify="space-between">
								<Text size="xs">Carboidratos:</Text>
								<Text size="xs" fw={700}>
									{calculatedCarb}g ({calculatedCarb * 4} Kal)
								</Text>
							</Group>
							<Group justify="space-between">
								<Text size="xs">Fibras:</Text>
								<Text size="xs" fw={700}>
									{fiberGoal}g
								</Text>
							</Group>
							<Group
								justify="space-between"
								style={{ borderTop: '1px solid var(--mantine-color-dark-4)', paddingTop: '4px' }}
							>
								<Text size="sm" fw={700}>
									Total diário estimado:
								</Text>
								<Text size="sm" fw={800} color="teal">
									{calculatedKcal} Kal
								</Text>
							</Group>
						</Stack>
					</Paper>

					<Button
						onClick={() => saveDietGoalsMutation.mutate()}
						loading={saveDietGoalsMutation.isPending}
						fullWidth
						mt="xs"
					>
						Salvar Configuração
					</Button>
				</Stack>
			</Modal>

			{/* New Meal Template Modal */}
			<Modal
				opened={newMealOpened}
				onClose={() => setNewMealOpened(false)}
				title="Nova Refeição de Referência"
				centered
				radius="md"
			>
				<Stack gap="md">
					<TextInput
						label="Nome da Refeição"
						placeholder="Ex: Café da Manhã, Almoço"
						required
						value={newMealName}
						onChange={(e) => setNewMealName(e.currentTarget.value)}
					/>
					<TextInput
						label="Horário"
						placeholder="Ex: 08:00, 12:30"
						required
						value={newMealTime}
						onChange={(e) => setNewMealTime(e.currentTarget.value)}
					/>
					<Button
						onClick={() => addMealMutation.mutate()}
						loading={addMealMutation.isPending}
						disabled={!newMealName || !newMealTime}
						fullWidth
						mt="xs"
					>
						Cadastrar Refeição
					</Button>
				</Stack>
			</Modal>

			{/* Edit Meal Template Modal */}
			<Modal
				opened={editingMeal !== null}
				onClose={() => setEditingMeal(null)}
				title="Editar Refeição de Referência"
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
						placeholder="Ex: 08:00, 12:30"
						required
						value={editMealTime}
						onChange={(e) => setEditMealTime(e.currentTarget.value)}
					/>
					<Button
						onClick={() => updateMealMutation.mutate()}
						loading={updateMealMutation.isPending}
						disabled={!editMealName || !editMealTime}
						fullWidth
						mt="xs"
					>
						Confirmar Alterações
					</Button>
				</Stack>
			</Modal>

			{/* Edit Reference Food Portion Modal */}
			<Modal
				opened={editingFood !== null}
				onClose={() => setEditingFood(null)}
				title={editingFood ? `Editar Porção de ${editingFood.food.name}` : ''}
				centered
				radius="md"
			>
				<Stack gap="md">
					<Text size="sm" c="dimmed">
						Informe a quantidade de referência em gramas para este alimento.
					</Text>

					<NumberInput
						label="Quantidade de Referência (g)"
						placeholder="100"
						value={editFoodQuantity}
						onChange={(val) => setEditFoodQuantity(Number(val) || 0)}
						min={1}
						required
					/>

					{editingFood && editFoodQuantity > 0 && (
						<Paper withBorder p="xs" radius="xs" bg="var(--mantine-color-dark-8)">
							<Stack gap={4}>
								<Center>
									<Text fw={800} size="md" c="dimmed">
										{((editingFood.food.calories * editFoodQuantity) / 100).toFixed(0)} Kcal
									</Text>
								</Center>
								<SimpleGrid cols={4} spacing="xs" style={{ textAlign: 'center' }}>
									<Stack gap={0}>
										<Text size="xs" c="dimmed">P</Text>
										<Text size="xs" fw={700} c="red.6">
											{((editingFood.food.protein * editFoodQuantity) / 100).toFixed(1)}g
										</Text>
									</Stack>
									<Stack gap={0}>
										<Text size="xs" c="dimmed">C</Text>
										<Text size="xs" fw={700} c="yellow.5">
											{((editingFood.food.carbohydrate * editFoodQuantity) / 100).toFixed(1)}g
										</Text>
									</Stack>
									<Stack gap={0}>
										<Text size="xs" c="dimmed">G</Text>
										<Text size="xs" fw={700} c="green.6">
											{((editingFood.food.lipids * editFoodQuantity) / 100).toFixed(1)}g
										</Text>
									</Stack>
									<Stack gap={0}>
										<Text size="xs" c="dimmed">F</Text>
										<Text size="xs" fw={700} c="teal.5">
											{((editingFood.food.fiber * editFoodQuantity) / 100).toFixed(1)}g
										</Text>
									</Stack>
								</SimpleGrid>
							</Stack>
						</Paper>
					)}

					<Button
						onClick={() => {
							if (editingFood) {
								updateFoodPortionMutation.mutate({
									foodInMealId: editingFood.id,
									quantity: editFoodQuantity,
								})
							}
						}}
						loading={updateFoodPortionMutation.isPending}
						disabled={editFoodQuantity <= 0}
						fullWidth
						mt="xs"
					>
						Confirmar Nova Quantidade
					</Button>
				</Stack>
			</Modal>

			{activeDiet && (
				<ShareModal
					opened={shareModalOpen}
					onClose={() => setShareModalOpen(false)}
					resourceId={activeDiet.id}
					resourceType="diet"
					isExported={activeDiet.isExported ?? false}
					onToggleExport={async (newVal) => {
						await toggleDietExportMutation.mutateAsync({
							id: activeDiet.id,
							isExported: newVal,
						})
					}}
					loading={toggleDietExportMutation.isPending}
				/>
			)}
		</MainLayout>
	)
}
