import { Container } from '@mantine/core'
import { NewBodyMetricForm } from '../components/NewBodyMetricForm'
import { MainLayout } from '../../../../components/layout/MainLayout'
import { useGoBack } from '../../../../utils/navigation'

export function NewMetricPage() {
	const goBack = useGoBack('/profile')

	return (
		<MainLayout title="Registrar Pesagem" onBack={() => goBack('/profile')}>
			<Container size="xs" px={0} py="md">
				<NewBodyMetricForm />
			</Container>
		</MainLayout>
	)
}
