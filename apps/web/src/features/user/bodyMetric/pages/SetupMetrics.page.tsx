import { Center, Container, Title } from '@mantine/core'

import { BodyMetricRegisterForm } from '../components/BodyMetricsForm'

export function BodyMetricRegisterPage() {
	return (
		<Center style={{ minHeight: '100vh', backgroundColor: 'var(--mantine-color-dark-8)', padding: '20px 0' }}>
			<Container size={420} w="100%">
				<Title ta="center" fw={900} mb="xl" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '28px' }}>
					Registros Corporais
				</Title>
				<BodyMetricRegisterForm />
			</Container>
		</Center>
	)
}
