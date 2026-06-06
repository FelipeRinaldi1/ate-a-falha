import { Container } from '@mantine/core'
import { NewBodyMetricForm } from '../components/NewBodyMetricForm'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '../../../../components/layout/MainLayout'

export function NewMetricPage() {
	const navigate = useNavigate()

	return (
		<MainLayout title="Registrar Pesagem" onBack={() => navigate('/profile')}>
			<Container size="xs" px={0} py="md">
				<NewBodyMetricForm />
			</Container>
		</MainLayout>
	)
}
