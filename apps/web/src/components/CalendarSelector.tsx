import { Paper, Group, Text, Badge } from '@mantine/core'
import { Check } from 'lucide-react'

interface CalendarSelectorProps {
	weekDays: Date[]
	selectedDateStr: string
	onSelectDate: (date: Date) => void
	formatDateString: (date: Date) => string
	scheduledWorkouts?: Record<string, string>
	completedDays?: Record<string, boolean>
}

export function CalendarSelector({
	weekDays,
	selectedDateStr,
	onSelectDate,
	formatDateString,
	scheduledWorkouts,
	completedDays,
}: CalendarSelectorProps) {
	return (
		<Paper withBorder p="xs" radius="md" shadow="sm">
			<Group justify="space-between" grow gap="xs">
				{weekDays.map((day, idx) => {
					const dayStr = formatDateString(day)
					const isSelected = dayStr === selectedDateStr
					const dayName = day.toLocaleDateString('pt-BR', { weekday: 'short' })
					const dayNum = day.getDate()
					const workoutLetter = scheduledWorkouts?.[day.getDay().toString()]
					const isCompleted = !!completedDays?.[dayStr]

					return (
						<Paper
							key={idx}
							onClick={() => onSelectDate(day)}
							style={{
								cursor: 'pointer',
								textAlign: 'center',
								padding: '8px 4px',
								backgroundColor: isSelected ? 'var(--mantine-primary-color-filled)' : 'transparent',
								color: isSelected ? 'white' : 'inherit',
								borderRadius: '8px',
								position: 'relative',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: '2px',
							}}
							withBorder={!isSelected}
						>
							<Text size="xs" fw={700} style={{ textTransform: 'capitalize', lineHeight: 1.1 }}>
								{dayNum}
							</Text>
							<Text size="10px" style={{ textTransform: 'lowercase', opacity: 0.8, lineHeight: 1.1 }}>
								{dayName.slice(0, 3)}
							</Text>
							{workoutLetter ? (
								isCompleted ? (
									<Badge
										size="xs"
										variant="filled"
										color="green"
										style={{
											fontSize: '9px',
											height: '18px',
											padding: '0 5px',
											textTransform: 'uppercase',
											fontWeight: 800,
										}}
									>
										<Group gap={2} wrap="nowrap" justify="center">
											<Check size={10} strokeWidth={3} />
											<span>{workoutLetter}</span>
										</Group>
									</Badge>
								) : (
									<Badge
										size="xs"
										variant="outline"
										color={isSelected ? 'white' : 'brand'}
										style={{
											fontSize: '9px',
											height: '18px',
											padding: '0 5px',
											textTransform: 'uppercase',
											fontWeight: 700,
											backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
											borderWidth: '1.5px',
										}}
									>
										{workoutLetter}
									</Badge>
								)
							) : (
								<div style={{ height: '18px' }} />
							)}
						</Paper>
					)
				})}
			</Group>
		</Paper>
	)
}
