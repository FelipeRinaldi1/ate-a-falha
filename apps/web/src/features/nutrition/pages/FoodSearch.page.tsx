import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
	Select,
	SegmentedControl,
} from '@mantine/core'
import { Plus, Search, Trash2 } from 'lucide-react'
import { useDebouncedValue } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { MainLayout } from '../../../components/layout/MainLayout'
import { api } from '../../../api/axiosInstance'
import { useAuth } from '../../user/hooks/useAuth'
import { type FoodDTO } from '@ate-a-falha/shared'

export function FoodSearchPage() {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const queryClient = useQueryClient()
	const { user } = useAuth()

	const mealLogId = searchParams.get('mealLogId')
	const mealId = searchParams.get('mealId')

	const [searchQuery, setSearchQuery] = useState('')
	const [debouncedSearch] = useDebouncedValue(searchQuery, 300)
	const [filterBy, setFilterBy] = useState<string | null>(null)
	const [foodScope, setFoodScope] = useState<'all' | 'mine'>('all')

	// State for adding food portion
	const [selectedFood, setSelectedFood] = useState<FoodDTO | null>(null)
	const [portionGrams, setPortionGrams] = useState<number>(100)

	// Fetch catalog foods
	const { data: foods = [], isLoading } = useQuery<FoodDTO[]>({
		queryKey: ['food-catalog', debouncedSearch],
		queryFn: async () => {
			const res = await api.get('/nutrition/food-catalog', {
				params: { name: debouncedSearch.trim() || undefined, take: 100 },
			})
			return res.data
		},
	})

	// Mutation: Log Food in Meal
	const addFoodMutation = useMutation({
		mutationFn: async ({ foodId, quantity }: { foodId: string; quantity: number }) => {
			if (mealId) {
				return api.post(`/nutrition/meals/${mealId}/foods`, {
					foodId,
					quantity,
				})
			}
			if (!mealLogId) throw new Error('Meal Log ID or Meal Template ID is required')
			return api.post(`/nutrition/meal-logs/${mealLogId}/foods`, {
				foodId,
				quantity,
			})
		},
		onSuccess: () => {
			if (mealId) {
				queryClient.invalidateQueries({ queryKey: ['target-meals'] })
				queryClient.invalidateQueries({ queryKey: ['diets'] })
				setSelectedFood(null)
				setPortionGrams(100)
				navigate('/nutrition/goals')
				return
			}
			queryClient.invalidateQueries({ queryKey: ['meal-log', mealLogId] })
			queryClient.invalidateQueries({ queryKey: ['diet-logs'] })
			setSelectedFood(null)
			setPortionGrams(100)
			if (mealLogId) {
				navigate(`/nutrition/meals/${mealLogId}`)
			} else {
				navigate('/nutrition')
			}
		},
	})

	// Mutation: Exclude food from catalog
	const deleteCatalogFoodMutation = useMutation({
		mutationFn: async (foodId: string) => {
			return api.delete(`/nutrition/food-catalog/${foodId}`)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['food-catalog'] })
			queryClient.invalidateQueries({ queryKey: ['diet-logs'] })
		},
	})

	const handleDeleteFood = (e: React.MouseEvent, food: FoodDTO) => {
		e.stopPropagation()
		modals.openConfirmModal({
			title: 'Excluir Alimento',
			centered: true,
			children: (
				<Text size="sm">
					Tem certeza que deseja excluir o alimento <strong>{food.name}</strong> permanentemente do seu
					catálogo? Esta ação não pode ser desfeita.
				</Text>
			),
			labels: { confirm: 'Excluir', cancel: 'Cancelar' },
			confirmProps: { color: 'red' },
			onConfirm: () => deleteCatalogFoodMutation.mutate(food.id),
		})
	}

	const handleFoodClick = (food: FoodDTO) => {
		if (mealLogId || mealId) {
			setSelectedFood(food)
		} else {
			// Redireciona para a página de detalhes do alimento no catálogo se acessado pela lupa geral
			navigate(`/nutrition/food-catalog/${food.id}`)
		}
	}

	const handleAddPortionSubmit = () => {
		if (!selectedFood || portionGrams <= 0) return
		addFoodMutation.mutate({
			foodId: selectedFood.id,
			quantity: portionGrams,
		})
	}

	// Apply sorting/filtering/scope logic with useMemo to keep typing silky smooth
	const processedFoods = useMemo(() => {
		let result = [...foods]

		// Filter by scope (Only My Foods created by the active user)
		if (foodScope === 'mine' && user) {
			result = result.filter((f) => f.userId === user.id)
		}

		if (filterBy === 'high-protein') {
			result.sort((a, b) => b.protein - a.protein)
		} else if (filterBy === 'low-kcal') {
			result.sort((a, b) => a.calories - b.calories)
		} else if (filterBy === 'high-carb') {
			result.sort((a, b) => b.carbohydrate - a.carbohydrate)
		} else if (filterBy === 'low-fat') {
			result.sort((a, b) => a.lipids - b.lipids)
		}
		return result
	}, [foods, foodScope, user, filterBy])

	return (
		<MainLayout
			title="Procurar Alimento"
			onBack={() => {
				if (mealId) {
					navigate('/nutrition/goals')
				} else if (mealLogId) {
					navigate(`/nutrition/meals/${mealLogId}`)
				} else {
					navigate('/nutrition')
				}
			}}
			actions={
				<ActionIcon variant="filled" color="gray" size="md" onClick={() => navigate('/nutrition/create-food')}>
					<Plus size={20} />
				</ActionIcon>
			}
		>
			<Container size="xs" px={0}>
				<Stack gap="md">
					{/* Search Input Box */}
					<TextInput
						placeholder="Pesquisar..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.currentTarget.value)}
						rightSection={<Search size={16} color="gray" />}
						radius="md"
						size="md"
					/>

					{/* Segmented Control Scope Filter */}
					<SegmentedControl
						fullWidth
						value={foodScope}
						onChange={(val) => setFoodScope(val as 'all' | 'mine')}
						data={[
							{ label: 'Todos os Alimentos', value: 'all' },
							{ label: 'Meus Alimentos', value: 'mine' },
						]}
						radius="md"
					/>

					{/* Sorting Dropdown Filter */}
					<Select
						placeholder="Filtrar por..."
						value={filterBy}
						onChange={(val) => setFilterBy(val)}
						allowDeselect
						data={[
							{ value: 'high-protein', label: 'Maior quantidade de Proteína' },
							{ value: 'high-carb', label: 'Maior quantidade de Carboidrato' },
							{ value: 'low-kcal', label: 'Menor valor Calórico' },
							{ value: 'low-fat', label: 'Menor quantidade de Gordura' },
						]}
						radius="md"
						size="md"
					/>

					{/* Section Titles */}
					<Stack gap={2} mt="xs">
						<Title order={3} size="h4" fw={700}>
							{foodScope === 'mine' ? 'Meus Alimentos' : 'Todos os Alimentos'}
						</Title>
						<Text size="xs" c="dimmed">
							Exibindo {processedFoods.length} alimentos
						</Text>
					</Stack>

					{/* Foods List */}
					{isLoading ? (
						<Center style={{ height: '30vh' }}>
							<Loader size="md" />
						</Center>
					) : processedFoods.length > 0 ? (
						<Stack gap="sm">
							{processedFoods.map((food) => (
								<Paper
									key={food.id}
									withBorder
									p="md"
									radius="md"
									shadow="xs"
									style={{ cursor: 'pointer' }}
									onClick={() => handleFoodClick(food)}
								>
									<Stack gap="xs">
										<Group justify="space-between" align="center">
											<Group gap={6}>
												<Text fw={700} size="sm">
													{food.name}
												</Text>
												{food.userId === user?.id && (
													<Text
														span
														size="10px"
														fw={700}
														c="teal"
														bg="teal.9"
														px={6}
														py={2}
														style={{ borderRadius: '4px' }}
													>
														Meu
													</Text>
												)}
											</Group>
											<Group gap="xs">
												<Text fw={700} size="sm" c="dimmed">
													{food.calories.toFixed(0)} Kal{' '}
													<Text span size="xs" fw={500} c="dimmed">
														/100g
													</Text>
												</Text>
												{food.userId === user?.id && (
													<ActionIcon
														variant="subtle"
														color="red"
														size="sm"
														onClick={(e) => handleDeleteFood(e, food)}
														loading={
															deleteCatalogFoodMutation.isPending &&
															deleteCatalogFoodMutation.variables === food.id
														}
													>
														<Trash2 size={14} />
													</ActionIcon>
												)}
											</Group>
										</Group>

										<SimpleGrid cols={4} spacing="xs" style={{ textAlign: 'center' }}>
											<Stack gap={0}>
												<Text size="xs" c="dimmed">
													Prot
												</Text>
												<Text size="xs" fw={700} c="red.6">
													{food.protein.toFixed(1)}g
												</Text>
											</Stack>
											<Stack gap={0}>
												<Text size="xs" c="dimmed">
													Carb
												</Text>
												<Text size="xs" fw={700} c="yellow.5">
													{food.carbohydrate.toFixed(1)}g
												</Text>
											</Stack>
											<Stack gap={0}>
												<Text size="xs" c="dimmed">
													Gord
												</Text>
												<Text size="xs" fw={700} c="green.6">
													{food.lipids.toFixed(1)}g
												</Text>
											</Stack>
											<Stack gap={0}>
												<Text size="xs" c="dimmed">
													Fibr
												</Text>
												<Text size="xs" fw={700} c="teal.5">
													{food.fiber.toFixed(1)}g
												</Text>
											</Stack>
										</SimpleGrid>
									</Stack>
								</Paper>
							))}
						</Stack>
					) : (
						<Paper withBorder p="xl" radius="md" style={{ textAlign: 'center' }} shadow="sm">
							<Stack gap="xs" align="center">
								<Text size="sm" c="dimmed">
									Nenhum alimento encontrado.
								</Text>
								<Button variant="outline" size="xs" onClick={() => navigate('/nutrition/create-food')}>
									Criar Novo Alimento
								</Button>
							</Stack>
						</Paper>
					)}
				</Stack>
			</Container>

			{/* Modal to input Portion Quantity (grams) */}
			<Modal
				opened={selectedFood !== null}
				onClose={() => setSelectedFood(null)}
				title={selectedFood ? `Adicionar ${selectedFood.name}` : ''}
				centered
				radius="md"
			>
				<Stack gap="md">
					<Text size="sm">
						Informe a quantidade consumida para calcular e adicionar as calorias e macronutrientes
						correspondentes à refeição.
					</Text>

					<NumberInput
						label="Quantidade consumida (g)"
						placeholder="100"
						value={portionGrams}
						onChange={(val) => setPortionGrams(Number(val) || 0)}
						min={1}
						required
					/>

					{selectedFood && portionGrams > 0 && (
						<Paper withBorder p="xs" radius="xs" bg="var(--mantine-color-dark-8)">
							<Stack gap={4}>
								<Center>
									<Text fw={700} size="sm">
										Resumo da Porção ({portionGrams}g):
									</Text>
								</Center>
								<Center>
									<Text fw={800} size="md" c="dimmed">
										{((selectedFood.calories * portionGrams) / 100).toFixed(0)} Kcal
									</Text>
								</Center>
								<SimpleGrid cols={4} spacing="xs" style={{ textAlign: 'center' }}>
									<Stack gap={0}>
									<Text size="xs" c="dimmed">P</Text>
									<Text size="xs" fw={700} c="red.6">{((selectedFood.protein * portionGrams) / 100).toFixed(1)}g</Text>
								</Stack>
								<Stack gap={0}>
									<Text size="xs" c="dimmed">C</Text>
									<Text size="xs" fw={700} c="yellow.5">{((selectedFood.carbohydrate * portionGrams) / 100).toFixed(1)}g</Text>
								</Stack>
								<Stack gap={0}>
									<Text size="xs" c="dimmed">G</Text>
									<Text size="xs" fw={700} c="green.6">{((selectedFood.lipids * portionGrams) / 100).toFixed(1)}g</Text>
								</Stack>
								<Stack gap={0}>
									<Text size="xs" c="dimmed">F</Text>
									<Text size="xs" fw={700} c="teal.5">{((selectedFood.fiber * portionGrams) / 100).toFixed(1)}g</Text>
								</Stack>
								</SimpleGrid>
							</Stack>
						</Paper>
					)}

					<Button
						onClick={handleAddPortionSubmit}
						loading={addFoodMutation.isPending}
						disabled={portionGrams <= 0}
						fullWidth
						mt="xs"
					>
						Adicionar à Refeição
					</Button>
				</Stack>
			</Modal>
		</MainLayout>
	)
}
