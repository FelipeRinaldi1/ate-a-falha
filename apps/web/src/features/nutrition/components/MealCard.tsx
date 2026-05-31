import { Paper, Stack, Group, Title, Text, SimpleGrid } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { NutritionLogic, type MealLogDTO, type FoodLogDTO } from '@ate-a-falha/shared'

interface MealCardProps {
	meal: MealLogDTO
}

export function MealCard({ meal }: MealCardProps) {
	const navigate = useNavigate()
	const mealFoods = meal.foods || []
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
		<Paper
			withBorder
			p="md"
			radius="md"
			shadow="sm"
			style={{ cursor: 'pointer' }}
			onClick={() => navigate(`/nutrition/meals/${meal.id}`)}
		>
			<Stack gap="xs">
				<Group justify="space-between" align="center">
					<Group gap="xs" align="center">
						<Title order={4} size="h5">
							{meal.name}
						</Title>
						<Text size="xs" c="dimmed" fw={500} style={{ alignSelf: 'center', marginTop: '2px' }}>
							({meal.time})
						</Text>
					</Group>
					<Text fw={700} size="sm" c="dimmed">
						{mealTotals.calories.toFixed(0)} Kal
					</Text>
				</Group>
				<SimpleGrid cols={4} spacing="xs" style={{ textAlign: 'center' }}>
					<Stack gap={0}>
						<Text size="xs" c="dimmed">
							Prot
						</Text>
						<Text size="xs" fw={700} c="red.6">
							{mealTotals.proteins.toFixed(0)}g
						</Text>
					</Stack>
					<Stack gap={0}>
						<Text size="xs" c="dimmed">
							Carb
						</Text>
						<Text size="xs" fw={700} c="yellow.5">
							{mealTotals.carbohydrates.toFixed(0)}g
						</Text>
					</Stack>
					<Stack gap={0}>
						<Text size="xs" c="dimmed">
							Gord
						</Text>
						<Text size="xs" fw={700} c="green.6">
							{mealTotals.fats.toFixed(0)}g
						</Text>
					</Stack>
					<Stack gap={0}>
						<Text size="xs" c="dimmed">
							Fibr
						</Text>
						<Text size="xs" fw={700} c="teal.5">
							{mealTotals.fiber.toFixed(0)}g
						</Text>
					</Stack>
				</SimpleGrid>
			</Stack>
		</Paper>
	)
}
