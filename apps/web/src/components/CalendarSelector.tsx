import { Paper, Group, Text } from '@mantine/core'

interface CalendarSelectorProps {
	weekDays: Date[]
	selectedDateStr: string
	onSelectDate: (date: Date) => void
	formatDateString: (date: Date) => string
}

export function CalendarSelector({ weekDays, selectedDateStr, onSelectDate, formatDateString }: CalendarSelectorProps) {
	return (
		<Paper withBorder p="xs" radius="md" shadow="sm">
			<Group justify="space-between" grow gap="xs">
				{weekDays.map((day, idx) => {
					const isSelected = formatDateString(day) === selectedDateStr
					const dayName = day.toLocaleDateString('pt-BR', { weekday: 'short' })
					const dayNum = day.getDate()

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
							}}
							withBorder={!isSelected}
						>
							<Text size="xs" fw={700} style={{ textTransform: 'capitalize' }}>
								{dayNum}
							</Text>
							<Text size="xs" style={{ textTransform: 'lowercase' }}>
								{dayName.slice(0, 3)}
							</Text>
						</Paper>
					)
				})}
			</Group>
		</Paper>
	)
}
