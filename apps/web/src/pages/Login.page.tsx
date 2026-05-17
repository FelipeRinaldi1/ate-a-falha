import { Container, Title, Text, Anchor, Center } from '@mantine/core'
import { Link } from 'react-router-dom'
import { LoginForm } from '../features/user/components/LoginForm'

export function LoginPage() {
	return (
		<Center style={{ height: '100vh', backgroundColor: 'var(--mantine-color-gray-0)' }}>
			<Container size={420} w="100%">
				<Title ta="center" fw={900}>
					Welcome back!
				</Title>
				<Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
					Do not have an account yet?{' '}
					<Anchor size="sm" component={Link} to="/register">
						Create account
					</Anchor>
				</Text>

				<LoginForm />
			</Container>
		</Center>
	)
}
