import { Container, Title, Text, Anchor, Center } from '@mantine/core'
import { Link } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
	return (
		<Center style={{ height: '100vh', backgroundColor: 'var(--mantine-color-dark-8)' }}>
			<Container size={420} w="100%">
				<Title ta="center" fw={900} style={{ fontFamily: 'Outfit, sans-serif', fontSize: '32px' }}>
					Até a Falha
				</Title>
				<Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
					Não tem uma conta ainda?{' '}
					<Anchor size="sm" component={Link} to="/register">
						Criar conta
					</Anchor>
				</Text>

				<LoginForm />
			</Container>
		</Center>
	)
}
