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
	const proteinPercent = kcalTarget > 0 ? (proteinKcal / kcalTarget) * 100 : 0
	const carbPercent = kcalTarget > 0 ? (carbKcal / kcalTarget) * 100 : 0
	const fatPercent = kcalTarget > 0 ? (fatKcal / kcalTarget) * 100 : 0

	return (
		<Paper withBorder p="md" radius="md" shadow="sm">
			<Stack gap="md">
				<Group justify="space-between" align="center">
					<Stack gap={2}>
						<Text fw={800} size="lg" c={isExceeded ? 'red.6' : undefined}>
							{calories.toFixed(0)}{' '}
							<Text span size="sm" fw={500} c="dimmed">
								/ {kcalTarget} Kcal
							</Text>
						</Text>
						<Text size="xs" c="dimmed">
							{isExceeded
								? `Excedeu ${Math.abs(calories - kcalTarget).toFixed(0)} Kcal da meta`
								: `Restam ${(kcalTarget - calories).toFixed(0)} Kcal`}
						</Text>
					</Stack>
					{onEditClick && (
						<ActionIcon variant="light" size="sm" color="gray" onClick={onEditClick}>
							<Pencil size={14} />
						</ActionIcon>
					)}
				</Group>

				{/* Multi-segment Progress Bar */}
				<Progress.Root size="lg" radius="xl">
					<Progress.Section value={proteinPercent} color="red.6" />
					<Progress.Section value={carbPercent} color="yellow.5" />
					<Progress.Section value={fatPercent} color="green.6" />
				</Progress.Root>

				<SimpleGrid cols={4} spacing="xs">
					<Card withBorder p="xs" radius="md" style={{ textAlign: 'center' }}>
						<Text size="xs" fw={700} c="red.6">
							Prot
						</Text>
						<Text size="sm" fw={800} mt={2}>
							{protein.toFixed(0)}g
						</Text>
						<Progress
							value={proteinTarget > 0 ? (protein / proteinTarget) * 100 : 0}
							color="red.6"
							size="xs"
							mt={6}
							radius="xl"
						/>
						<Text size="10px" c="dimmed" mt={4}>
							Meta: {proteinTarget}g
						</Text>
					</Card>

					<Card withBorder p="xs" radius="md" style={{ textAlign: 'center' }}>
						<Text size="xs" fw={700} c="yellow.5">
							Carb
						</Text>
						<Text size="sm" fw={800} mt={2}>
							{carb.toFixed(0)}g
						</Text>
						<Progress
							value={carbTarget > 0 ? (carb / carbTarget) * 100 : 0}
							color="yellow.5"
							size="xs"
							mt={6}
							radius="xl"
						/>
						<Text size="10px" c="dimmed" mt={4}>
							Meta: {carbTarget}g
						</Text>
					</Card>

					<Card withBorder p="xs" radius="md" style={{ textAlign: 'center' }}>
						<Text size="xs" fw={700} c="green.6">
							Gord
						</Text>
						<Text size="sm" fw={800} mt={2}>
							{fat.toFixed(0)}g
						</Text>
						<Progress
							value={fatTarget > 0 ? (fat / fatTarget) * 100 : 0}
							color="green.6"
							size="xs"
							mt={6}
							radius="xl"
						/>
						<Text size="10px" c="dimmed" mt={4}>
							Meta: {fatTarget}g
						</Text>
					</Card>

					<Card withBorder p="xs" radius="md" style={{ textAlign: 'center' }}>
						<Text size="xs" fw={700} c="teal.5">
							Fibr
						</Text>
						<Text size="sm" fw={800} mt={2}>
							{fiber.toFixed(0)}g
						</Text>
						<Progress
							value={fiberTarget > 0 ? (fiber / fiberTarget) * 100 : 0}
							color="teal.5"
							size="xs"
							mt={6}
							radius="xl"
						/>
						<Text size="10px" c="dimmed" mt={4}>
							Meta: {fiberTarget}g
						</Text>
					</Card>
				</SimpleGrid>
			</Stack>
		</Paper>
	)
}

