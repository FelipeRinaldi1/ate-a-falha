import { Paper, Group, Text, Badge } from '@mantine/core'

interface CalendarSelectorProps {
	weekDays: Date[]
	selectedDateStr: string
	onSelectDate: (date: Date) => void
	formatDateString: (date: Date) => string
	scheduledWorkouts?: Record<string, string>
}

export function CalendarSelector({ weekDays, selectedDateStr, onSelectDate, formatDateString, scheduledWorkouts }: CalendarSelectorProps) {
	return (
		<Paper withBorder p="xs" radius="md" shadow="sm">
			<Group justify="space-between" grow gap="xs">
				{weekDays.map((day, idx) => {
					const isSelected = formatDateString(day) === selectedDateStr
					const dayName = day.toLocaleDateString('pt-BR', { weekday: 'short' })
					const dayNum = day.getDate()
					const workoutLetter = scheduledWorkouts?.[day.getDay().toString()]

					return (
						<Paper
							key={idx}
							onClick={() => onSelectDate(day)}
							style={{
								cursor: 'pointer',
								textAlign: 'center',
								padding: '8px 4px',
								backgroundColor: isSelected ? 'var(--mantine-color-blue-filled)' : 'transparent',
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
								<Badge
									size="xs"
									variant={isSelected ? 'white' : 'filled'}
									color="blue"
									style={{
										fontSize: '9px',
										height: 'auto',
										padding: '1px 5px',
										textTransform: 'uppercase',
										fontWeight: 800,
									}}
								>
									{workoutLetter}
								</Badge>
							) : (
								<div style={{ height: '14px' }} />
							)}
						</Paper>
					)
				})}
			</Group>
		</Paper>
	)
}
