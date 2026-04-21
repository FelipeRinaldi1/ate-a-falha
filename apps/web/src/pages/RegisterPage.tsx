import { Container, Title, Text, Anchor, Center } from '@mantine/core'
import { Link } from 'react-router-dom'
import { RegisterForm } from '../features/auth/components/RegisterForm'

export function RegisterPage() {
	return (
		<Center style={{ minHeight: '100vh', backgroundColor: 'var(--mantine-color-gray-0)', padding: '20px 0' }}>
			<Container size={420} w="100%">
				<Title ta="center" fw={900}>
					Create an Account
				</Title>
				<Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
					Already have an account?{' '}
					<Anchor size="sm" component={Link} to="/login">
						Sign in
					</Anchor>
				</Text>

				<RegisterForm />
			</Container>
		</Center>
	)
}
