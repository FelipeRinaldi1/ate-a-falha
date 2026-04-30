import { Card, Group, Text, Stack } from '@mantine/core'

export default function WaterCard() {
	return (
		<Card withBorder shadow="sm" radius={'md'}>
			<Stack>
				<Group>
					<Text fw={500}>Agua</Text>
					<Text c={'dimmed'}>0/4000 </Text>
				</Group>
			</Stack>
		</Card>
	)
}
