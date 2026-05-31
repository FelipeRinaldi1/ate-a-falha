import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
	Container,
	Stack,
	Paper,
	Group,
	Text,
	Title,
	Button,
	Modal,
	TextInput,
	NumberInput,
	ActionIcon,
	Center,
	Loader,
	SimpleGrid,
} from '@mantine/core'
import { Trash2, Pencil, PlusCircle } from 'lucide-react'
import { modals } from '@mantine/modals'
import { MainLayout } from '../../../components/layout/MainLayout'
import { api } from '../../../api/axiosInstance'
import { NutritionLogic, type MealLogDTO, type FoodLogDTO } from '@ate-a-falha/shared'

export function MealDetailsPage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [editOpened, setEditOpened] = useState(false)
	const [editName, setEditName] = useState('')
	const [editTime, setEditTime] = useState('')

	// State for editing food portion
	const [editingFood, setEditingFood] = useState<FoodLogDTO | null>(null)
	const [editQuantity, setEditQuantity] = useState<number>(100)

	// Fetch Meal details
	const { data: meal, isLoading: isLoadingMeal } = useQuery<MealLogDTO>({
		queryKey: ['meal-log', id],
		queryFn: async () => {
			const res = await api.get(`/nutrition/meal-logs/${id}`)
			return res.data
		},
		enabled: !!id,
	})

	// Mutation: Update Meal name/time
	const updateMealMutation = useMutation({
		mutationFn: async ({ name, time }: { name: string; time: string }) => {
			return api.patch(`/nutrition/meal-logs/${id}`, { name, time })
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['meal-log', id] })
			queryClient.invalidateQueries({ queryKey: ['diet-logs'] })
			setEditOpened(false)
		},
	})

	// Mutation: Delete Food from Meal Log
	const removeFoodMutation = useMutation({
		mutationFn: async (foodLogId: string) => {
			return api.delete(`/nutrition/food-logs/${foodLogId}`)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['meal-log', id] })
			queryClient.invalidateQueries({ queryKey: ['diet-logs'] })
		},
	})

	// Mutation: Update Food portion quantity
	const updateFoodPortionMutation = useMutation({
		mutationFn: async ({ foodLogId, quantity }: { foodLogId: string; quantity: number }) => {
			return api.patch(`/nutrition/food-logs/${foodLogId}`, { quantity })
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['meal-log', id] })
			queryClient.invalidateQueries({ queryKey: ['diet-logs'] })
			setEditingFood(null)
		},
	})

	// Mutation: Exclude whole Meal Log
	const deleteMealMutation = useMutation({
		mutationFn: async () => {
			return api.delete(`/nutrition/meal-logs/${id}`)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['diet-logs'] })
			setEditOpened(false)
			navigate('/nutrition')
		},
	})

	const handleDeleteMeal = () => {
		modals.openConfirmModal({
			title: 'Excluir Refeição',
			centered: true,
			children: (
				<Text size="sm">Tem certeza que deseja excluir esta refeição? Esta ação não pode ser desfeita.</Text>
			),
			labels: { confirm: 'Excluir', cancel: 'Cancelar' },
			confirmProps: { color: 'red' },
			onConfirm: () => deleteMealMutation.mutate(),
		})
	}

	const handleRemoveFood = (foodLogId: string, name: string) => {
		modals.openConfirmModal({
			title: 'Remover Alimento',
			centered: true,
			children: (
				<Text size="sm">
					Tem certeza que deseja remover o alimento <strong>{name}</strong> desta refeição?
				</Text>
			),
			labels: { confirm: 'Remover', cancel: 'Cancelar' },
			confirmProps: { color: 'red' },
			onConfirm: () => removeFoodMutation.mutate(foodLogId),
		})
	}

	const handleOpenEditModal = () => {
		if (meal) {
			setEditName(meal.name)
			setEditTime(meal.time)
			setEditOpened(true)
		}
	}

	const handleOpenEditFood = (item: FoodLogDTO) => {
		setEditingFood(item)
		setEditQuantity(item.quantity)
	}

	if (isLoadingMeal) {
		return (
			<MainLayout title="Refeição" onBack={() => navigate('/nutrition')}>
				<Center style={{ height: '70vh' }}>
					<Loader size="lg" />
				</Center>
			</MainLayout>
		)
	}

	if (!meal) {
		return (
			<MainLayout title="Refeição" onBack={() => navigate('/nutrition')}>
				<Center style={{ height: '70vh' }}>
					<Text size="lg" c="dimmed">
						Refeição não encontrada.
					</Text>
				</Center>
			</MainLayout>
		)
	}

	const mealFoods = meal.foods || []

	// Calculate totals for the entire meal using shared logic
	const mealTotals = NutritionLogic.calculateMealMacros(
		mealFoods.map((f: FoodLogDTO) => ({
			id: f.id,
			foodId: f.foodId,
			food: f.food,
			quantity: f.quantity,
			mealId: f.mealLogId,
			createdAt: f.createdAt,
			updatedAt: f.updatedAt,
		}))
	)

	return (
		<MainLayout
			title="Refeição"
			onBack={() => navigate('/nutrition')}
			actions={
				<ActionIcon variant="subtle" color="gray" size="md" onClick={handleOpenEditModal}>
					<Pencil size={20} />
				</ActionIcon>
			}
		>
			<Container size="xs" px={0}>
				<Stack gap="md">
					{/* Subtitle / Name and Time of the meal centered */}
					<Center>
						<Title order={2} size="h3" fw={700} c="bright" style={{ letterSpacing: '-0.5px' }}>
							{meal.name} ({meal.time})
						</Title>
					</Center>

					{/* 1. Meal totals summary card */}
					<Paper withBorder p="md" shadow="sm" radius="md" bg="var(--mantine-color-dark-8)">
						<Stack gap="xs">
							<Center>
								<Text fw={800} size="xl" c="dimmed">
									{mealTotals.calories.toFixed(0)} Kcal
								</Text>
							</Center>

							<SimpleGrid cols={4} spacing="xs" style={{ textAlign: 'center' }}>
								<Stack gap={0}>
									<Text size="xs" fw={600} c="dimmed">
										Prot
									</Text>
									<Text size="sm" fw={700} c="red.6">
										{mealTotals.proteins.toFixed(0)}g
									</Text>
								</Stack>
								<Stack gap={0}>
									<Text size="xs" fw={600} c="dimmed">
										Carb
									</Text>
									<Text size="sm" fw={700} c="yellow.5">
										{mealTotals.carbohydrates.toFixed(0)}g
									</Text>
								</Stack>
								<Stack gap={0}>
									<Text size="xs" fw={600} c="dimmed">
										Gord
									</Text>
									<Text size="sm" fw={700} c="green.6">
										{mealTotals.fats.toFixed(0)}g
									</Text>
								</Stack>
								<Stack gap={0}>
									<Text size="xs" fw={600} c="dimmed">
										Fibr
									</Text>
									<Text size="sm" fw={700} c="teal.5">
										{mealTotals.fiber.toFixed(0)}g
									</Text>
								</Stack>
							</SimpleGrid>
						</Stack>
					</Paper>

					{/* 2. Listed Foods in the meal */}
					<Stack gap="sm">
						{mealFoods.length > 0 ? (
							mealFoods.map((item: FoodLogDTO) => {
								const itemMacros = NutritionLogic.calculateFoodInMealMacros({
									id: item.id,
									foodId: item.foodId,
									food: item.food,
									quantity: item.quantity,
									mealId: item.mealLogId,
									createdAt: item.createdAt,
									updatedAt: item.updatedAt,
								})

								return (
									<Paper
										key={item.id}
										withBorder
										p="md"
										radius="md"
										shadow="xs"
										style={{ position: 'relative' }}
									>
										<Stack gap="xs">
											<Group justify="space-between" align="flex-start" pr={70}>
												<Stack gap={2}>
													<Text fw={700} size="sm">
														{item.food.name}
													</Text>
													<Text size="xs" c="dimmed">
														Porção: {item.quantity}g
													</Text>
												</Stack>
												<Text fw={700} size="sm" c="dimmed">
													{itemMacros.calories.toFixed(0)} Kal
												</Text>
											</Group>

											<SimpleGrid cols={4} spacing="xs" style={{ textAlign: 'center' }}>
												<Stack gap={0}>
													<Text size="xs" c="dimmed">
														Prot
													</Text>
													<Text size="xs" fw={700} c="red.6">
														{itemMacros.proteins.toFixed(1)}g
													</Text>
												</Stack>
												<Stack gap={0}>
													<Text size="xs" c="dimmed">
														Carb
													</Text>
													<Text size="xs" fw={700} c="yellow.5">
														{itemMacros.carbohydrates.toFixed(1)}g
													</Text>
												</Stack>
												<Stack gap={0}>
													<Text size="xs" c="dimmed">
														Gord
													</Text>
													<Text size="xs" fw={700} c="green.6">
														{itemMacros.fats.toFixed(1)}g
													</Text>
												</Stack>
												<Stack gap={0}>
													<Text size="xs" c="dimmed">
														Fibr
													</Text>
													<Text size="xs" fw={700} c="teal.5">
														{itemMacros.fiber.toFixed(1)}g
													</Text>
												</Stack>
											</SimpleGrid>

											<Group gap={6} style={{ position: 'absolute', top: 12, right: 12 }}>
												<ActionIcon
													variant="subtle"
													color="gray"
													onClick={() => handleOpenEditFood(item)}
													size="sm"
												>
													<Pencil size={16} />
												</ActionIcon>
												<ActionIcon
													variant="subtle"
													color="red"
													onClick={() => handleRemoveFood(item.id, item.food.name)}
													size="sm"
												>
													<Trash2 size={16} />
												</ActionIcon>
											</Group>
										</Stack>
									</Paper>
								)
							})
						) : (
							<Paper withBorder p="xl" radius="md" style={{ textAlign: 'center' }} shadow="sm">
								<Text size="sm" c="dimmed">
									Nenhum alimento cadastrado nesta refeição.
								</Text>
							</Paper>
						)}
					</Stack>

					{/* 3. Button to go to the Add Food Page */}
					<Button
						variant="filled"
						color="gray"
						leftSection={<PlusCircle size={18} />}
						onClick={() => navigate(`/nutrition/search?mealLogId=${meal.id}`)}
						size="md"
						radius="md"
						fullWidth
						mt="md"
					>
						Adicionar Alimento +
					</Button>
				</Stack>
			</Container>

			{/* Modal to Edit Meal Name and Time */}
			<Modal
				opened={editOpened}
				onClose={() => setEditOpened(false)}
				title="Editar Refeição"
				centered
				radius="md"
			>
				<Stack gap="md">
					<TextInput
						label="Nome da Refeição"
						placeholder="Ex: Café da Manhã, Almoço"
						required
						value={editName}
						onChange={(e) => setEditName(e.currentTarget.value)}
					/>
					<TextInput
						label="Horário"
						placeholder="Ex: 08:00, 12:00"
						required
						value={editTime}
						onChange={(e) => setEditTime(e.currentTarget.value)}
					/>
					<Group grow gap="sm" mt="xs">
						<Button
							color="red"
							variant="outline"
							leftSection={<Trash2 size={16} />}
							onClick={handleDeleteMeal}
							loading={deleteMealMutation.isPending}
						>
							Excluir Refeição
						</Button>
						<Button
							onClick={() => updateMealMutation.mutate({ name: editName, time: editTime })}
							loading={updateMealMutation.isPending}
						>
							Salvar
						</Button>
					</Group>
				</Stack>
			</Modal>

			{/* Modal to Edit Food Portion Quantity */}
			<Modal
				opened={editingFood !== null}
				onClose={() => setEditingFood(null)}
				title={editingFood ? `Editar Porção de ${editingFood.food.name}` : ''}
				centered
				radius="md"
			>
				<Stack gap="md">
					<Text size="sm" c="dimmed">
						Informe a nova quantidade consumida para recalcular e atualizar as calorias e macronutrientes da
						refeição.
					</Text>

					<NumberInput
						label="Quantidade consumida (g)"
						placeholder="100"
						value={editQuantity}
						onChange={(val) => setEditQuantity(Number(val) || 0)}
						min={1}
						required
					/>

					{editingFood && editQuantity > 0 && (
						<Paper withBorder p="xs" radius="xs" bg="var(--mantine-color-dark-8)">
							<Stack gap={4}>
								<Center>
									<Text fw={700} size="sm">
										Nova Porção ({editQuantity}g):
									</Text>
								</Center>
								<Center>
									<Text fw={800} size="md" c="dimmed">
										{((editingFood.food.calories * editQuantity) / 100).toFixed(0)} Kcal
									</Text>
								</Center>
								<SimpleGrid cols={4} spacing="xs" style={{ textAlign: 'center' }}>
									<Stack gap={0}>
										<Text size="xs" c="dimmed">
											P
										</Text>
										<Text size="xs" fw={700}>
											{((editingFood.food.protein * editQuantity) / 100).toFixed(1)}g
										</Text>
									</Stack>
									<Stack gap={0}>
										<Text size="xs" c="dimmed">
											C
										</Text>
										<Text size="xs" fw={700}>
											{((editingFood.food.carbohydrate * editQuantity) / 100).toFixed(1)}g
										</Text>
									</Stack>
									<Stack gap={0}>
										<Text size="xs" c="dimmed">
											G
										</Text>
										<Text size="xs" fw={700}>
											{((editingFood.food.lipids * editQuantity) / 100).toFixed(1)}g
										</Text>
									</Stack>
									<Stack gap={0}>
										<Text size="xs" c="dimmed">
											F
										</Text>
										<Text size="xs" fw={700}>
											{((editingFood.food.fiber * editQuantity) / 100).toFixed(1)}g
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
									foodLogId: editingFood.id,
									quantity: editQuantity,
								})
							}
						}}
						loading={updateFoodPortionMutation.isPending}
						disabled={editQuantity <= 0}
						fullWidth
						mt="xs"
					>
						Salvar Alterações
					</Button>
				</Stack>
			</Modal>
		</MainLayout>
	)
}
