import { Container, Title, Text, Anchor, Center } from '@mantine/core'
import { Link } from 'react-router-dom'
import { RegisterForm } from '../features/user/components/RegisterForm'

export function RegisterPage() {
	return (
		<Center style={{ minHeight: '100vh', backgroundColor: 'var(--mantine-color-gray-0)', padding: '20px 0' }}>
			<Container size={420} w="100%">
				<Title ta="center" fw={900}>
					Criar uma conta
				</Title>
				<Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
					Já possui uma conta?{' '}
					<Anchor size="sm" component={Link} to="/login">
						Entrar
					</Anchor>
				</Text>

				<RegisterForm />
			</Container>
		</Center>
	)
}
