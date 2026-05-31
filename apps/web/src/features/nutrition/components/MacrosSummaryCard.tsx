import { Paper, Stack, Group, Text, Progress, SimpleGrid, Card, ActionIcon } from '@mantine/core'
import { Pencil } from 'lucide-react'

interface MacrosSummaryCardProps {
	calories: number
	kcalTarget: number
	protein: number
	proteinTarget: number
	carb: number
	carbTarget: number
	fat: number
	fatTarget: number
	fiber: number
	fiberTarget: number
	onEditClick?: () => void
}

export function MacrosSummaryCard({
	calories,
	kcalTarget,
	protein,
	proteinTarget,
	carb,
	carbTarget,
	fat,
	fatTarget,
	fiber,
	fiberTarget,
	onEditClick,
}: MacrosSummaryCardProps) {
	const isExceeded = calories > kcalTarget

	// Calorie contributions per macro
	const proteinKcal = protein * 4
	const carbKcal = carb * 4
	const fatKcal = fat * 9

	// Percentages relative to the daily kcal target
	const proteinPercent = (proteinKcal / kcalTarget) * 100
	const carbPercent = (carbKcal / kcalTarget) * 100
	const fatPercent = (fatKcal / kcalTarget) * 100

	return (
		<Paper withBorder p="md" radius="md" shadow="sm">
			<Stack gap="md">
				<Group justify="space-between" align="center">
					<Text fw={700} size="md" c={isExceeded ? 'red.6' : undefined}>
						{calories.toFixed(0)} / {kcalTarget} Kal
					</Text>
					{onEditClick && (
						<ActionIcon variant="subtle" size="sm" color="gray" onClick={onEditClick}>
							<Pencil size={16} />
						</ActionIcon>
					)}
				</Group>
				<Progress.Root size="xl" radius="xl">
					<Progress.Section value={proteinPercent} color="red" />
					<Progress.Section value={carbPercent} color="yellow" />
					<Progress.Section value={fatPercent} color="green" />
				</Progress.Root>

				<SimpleGrid cols={4} spacing="xs">
					<Card withBorder p="xs" radius="md" style={{ textAlign: 'center' }}>
						<Text size="xs" fw={700} c="dimmed">
							Prot
						</Text>
						<Text size="sm" fw={700}>
							{protein.toFixed(0)}g
						</Text>
						<Progress value={(protein / proteinTarget) * 100} color="red" size="xs" mt={4} />
					</Card>
					<Card withBorder p="xs" radius="md" style={{ textAlign: 'center' }}>
						<Text size="xs" fw={700} c="dimmed">
							Carb
						</Text>
						<Text size="sm" fw={700}>
							{carb.toFixed(0)}g
						</Text>
						<Progress value={(carb / carbTarget) * 100} color="yellow" size="xs" mt={4} />
					</Card>
					<Card withBorder p="xs" radius="md" style={{ textAlign: 'center' }}>
						<Text size="xs" fw={700} c="dimmed">
							Gord
						</Text>
						<Text size="sm" fw={700}>
							{fat.toFixed(0)}g
						</Text>
						<Progress value={(fat / fatTarget) * 100} color="green" size="xs" mt={4} />
					</Card>
					<Card withBorder p="xs" radius="md" style={{ textAlign: 'center' }}>
						<Text size="xs" fw={700} c="dimmed">
							Fibr
						</Text>
						<Text size="sm" fw={700}>
							{fiber.toFixed(0)}g
						</Text>
						<Progress value={(fiber / fiberTarget) * 100} color="teal" size="xs" mt={4} />
					</Card>
				</SimpleGrid>
			</Stack>
		</Paper>
	)
}
