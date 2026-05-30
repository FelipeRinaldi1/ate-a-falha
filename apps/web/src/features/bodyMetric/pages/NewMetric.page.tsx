import { Center, Container, Title, Button, Stack, Group } from '@mantine/core'
import { ArrowLeft } from 'lucide-react'
import { NewBodyMetricForm } from '../components/NewBodyMetricForm'
import { useNavigate } from 'react-router-dom'

export function NewMetricPage() {
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
						Registrar Nova Pesagem
					</Title>
					
					<NewBodyMetricForm />
				</Stack>
			</Container>
		</Center>
	)
}
