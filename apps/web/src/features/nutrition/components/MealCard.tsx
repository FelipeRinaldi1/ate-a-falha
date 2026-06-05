import { Paper, Stack, Group, Title, Text, SimpleGrid, ActionIcon } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Circle } from 'lucide-react'
import { NutritionLogic, type MealLogDTO, type MealDTO } from '@ate-a-falha/shared'

interface MealCardProps {
	meal: MealLogDTO | MealDTO
	isTemplate?: boolean
	isLogged?: boolean
	onToggle?: () => void
	isToggling?: boolean
}

export function MealCard({ meal, isTemplate = false, isLogged = false, onToggle, isToggling = false }: MealCardProps) {
	const navigate = useNavigate()
	const mealFoods = meal.foods || []
	const mealTotals = NutritionLogic.calculateMealMacros(
		mealFoods as unknown as Parameters<typeof NutritionLogic.calculateMealMacros>[0]
	)

	return (
		<Paper
			withBorder
			p="md"
			radius="md"
			shadow="sm"
			style={{
				cursor: 'pointer',
				borderStyle: isTemplate ? 'dashed' : 'solid',
				opacity: isTemplate ? 0.65 : 1,
				backgroundColor: isLogged ? 'rgba(40, 167, 69, 0.03)' : undefined,
				borderColor: isLogged ? 'var(--mantine-color-green-7)' : undefined,
			}}
			onClick={() => {
				if (isTemplate) {
					onToggle?.()
				} else {
					navigate(`/nutrition/meals/${meal.id}`)
				}
			}}
		>
			<Stack gap="xs">
				<Group justify="space-between" align="center" wrap="nowrap">
					<Group gap="sm" align="center" style={{ flex: 1, minWidth: 0 }}>
						{onToggle && (
							<ActionIcon
								variant="subtle"
								color={isLogged ? 'green' : 'gray'}
								loading={isToggling}
								onClick={(e) => {
									e.stopPropagation()
									onToggle()
								}}
							>
								{isLogged ? <CheckCircle2 size={20} /> : <Circle size={20} />}
							</ActionIcon>
						)}
						<Group gap="xs" align="center" style={{ flex: 1, minWidth: 0 }}>
							<Title order={4} size="h5" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
								{meal.name}
							</Title>
							<Text size="xs" c="dimmed" fw={500} style={{ alignSelf: 'center', marginTop: '2px' }}>
								({meal.time})
							</Text>
						</Group>
					</Group>
					<Text fw={700} size="sm" c="dimmed" style={{ flexShrink: 0 }}>
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
