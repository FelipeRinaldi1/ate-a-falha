import { Paper, Stack, Group, Title, ActionIcon, Text, SimpleGrid } from '@mantine/core'
import { Pencil } from 'lucide-react'
import { NutritionLogic, type MealLogDTO, type FoodLogDTO } from '@ate-a-falha/shared'

interface MealCardProps {
	meal: MealLogDTO
	onEditClick: (meal: MealLogDTO) => void
}

export function MealCard({ meal, onEditClick }: MealCardProps) {
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
		<Paper withBorder p="md" radius="md" shadow="sm">
			<Stack gap="xs">
				<Group justify="space-between" align="center">
					<Group gap="xs">
						<Title order={4} size="h5">
							{meal.name}
						</Title>
						<ActionIcon variant="subtle" size="xs" color="gray" onClick={() => onEditClick(meal)}>
							<Pencil size={12} />
						</ActionIcon>
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
						<Text size="xs" fw={700}>
							{mealTotals.proteins.toFixed(0)}g
						</Text>
					</Stack>
					<Stack gap={0}>
						<Text size="xs" c="dimmed">
							Carb
						</Text>
						<Text size="xs" fw={700}>
							{mealTotals.carbohydrates.toFixed(0)}g
						</Text>
					</Stack>
					<Stack gap={0}>
						<Text size="xs" c="dimmed">
							Gord
						</Text>
						<Text size="xs" fw={700}>
							{mealTotals.fats.toFixed(0)}g
						</Text>
					</Stack>
					<Stack gap={0}>
						<Text size="xs" c="dimmed">
							Fibr
						</Text>
						<Text size="xs" fw={700}>
							{mealTotals.fiber.toFixed(0)}g
						</Text>
					</Stack>
				</SimpleGrid>
			</Stack>
		</Paper>
	)
}
