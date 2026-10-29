import { Container } from '@mantine/core'
import { EditBodyMetricsForm } from '../components/EditBodyMetricsForm'
import { MainLayout } from '../../../../components/layout/MainLayout'
import { useGoBack } from '../../../../utils/navigation'

export function EditMetricsPage() {
	const goBack = useGoBack('/profile')

	return (
		<MainLayout title="Editar Métricas" onBack={() => goBack('/profile')}>
			<Container size="xs" px={0} py="md">
				<EditBodyMetricsForm />
			</Container>
		</MainLayout>
	)
}
