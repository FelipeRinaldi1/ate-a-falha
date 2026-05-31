import { Paper, Group, Stack, Text, ActionIcon, Progress } from '@mantine/core'
import { Plus, Minus, Pencil } from 'lucide-react'

interface WaterCardProps {
	waterCurrent: number
	waterTarget: number
	onUpdateWater: (amount: number) => void
	isPending: boolean
	onEditTargetClick?: () => void
}

export function WaterCard({ waterCurrent, waterTarget, onUpdateWater, isPending, onEditTargetClick }: WaterCardProps) {
	return (
		<Paper withBorder p="md" radius="md" shadow="sm">
			<Stack gap="xs">
				<Group justify="space-between" align="center">
					<Group gap="xs">
						<Text fw={700} size="md">
							Água - {waterCurrent} / {waterTarget} ml
						</Text>
						{onEditTargetClick && (
							<ActionIcon variant="subtle" size="xs" color="gray" onClick={onEditTargetClick}>
								<Pencil size={12} />
							</ActionIcon>
						)}
					</Group>
					<Group gap="xs">
						<ActionIcon
							variant="light"
							color="blue"
							onClick={() => onUpdateWater(-250)}
							disabled={waterCurrent === 0 || isPending}
						>
							<Minus size={16} />
						</ActionIcon>
						<ActionIcon
							variant="light"
							color="blue"
							onClick={() => onUpdateWater(250)}
							disabled={isPending}
						>
							<Plus size={16} />
						</ActionIcon>
					</Group>
				</Group>
				<Progress value={(waterCurrent / waterTarget) * 100} color="blue" size="lg" radius="xl" />
			</Stack>
		</Paper>
	)
}
