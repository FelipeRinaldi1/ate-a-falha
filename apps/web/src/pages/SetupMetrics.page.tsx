import { Center, Container, Title } from '@mantine/core'

import { BodyMetricRegisterForm } from '../features/bodyMetric/components/BodyMetricsForm'

export function BodyMetricRegisterPage() {
	return (
		<Center>
			<Container>
				<Title>Criar registros corporais</Title>
				<BodyMetricRegisterForm />
			</Container>
		</Center>
	)
}
