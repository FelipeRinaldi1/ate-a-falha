import { Center, Container, Title, Button, Stack, Group } from '@mantine/core'
import { ArrowLeft } from 'lucide-react'
import { EditBodyMetricsForm } from '../components/EditBodyMetricsForm'
import { useNavigate } from 'react-router-dom'

export function EditMetricsPage() {
	const navigate = useNavigate()

	return (
		<Center style={{ minHeight: '80vh', padding: '24px 0' }}>
			<Container size="xs" w="100%">
				<Stack gap="lg">
					<Group>
						<Button 
							variant="subtle" 
							leftSection={<ArrowLeft size={16} />} 
							onClick={() => navigate('/profile')}
							size="xs"
							color="gray"
						>
							Voltar ao Perfil
						</Button>
					</Group>
					
					<Title order={2} style={{ textAlign: 'center', letterSpacing: '-0.5px' }}>
						Editar Métricas Corporais
					</Title>
					
					<EditBodyMetricsForm />
				</Stack>
			</Container>
		</Center>
	)
}
