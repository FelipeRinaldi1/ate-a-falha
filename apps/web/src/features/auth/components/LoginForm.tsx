import { useForm, schemaResolver } from '@mantine/form'
import { TextInput, PasswordInput, Button, Stack, Paper } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { api } from '../../../api/instance.js'
import { loginSchema, type LoginDTO } from '@ate-a-falha/shared'
import { useAuth } from '../../../providers/AuthProvider'
import { useNavigate } from 'react-router-dom'

export function LoginForm() {
	const { login } = useAuth()

	const form = useForm<LoginDTO>({
		initialValues: {
			email: '',
			password: '',
		},
		validate: schemaResolver(loginSchema, { sync: true }),
	})

	const mutation = useMutation({
		mutationFn: (credentials: LoginDTO) => {
			return api.post('/users/login', credentials)
		},
		onSuccess: (response) => {
			console.log('Login success:', response.data)
			login(response.data.user)
		},
		onError: (error) => {
			console.error('Login error:', error)
		},
	})

	return (
		<Paper withBorder shadow="md" p={30} mt={30} radius="md">
			<form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
				<Stack>
					<TextInput label="Email" placeholder="seu@email.com" required {...form.getInputProps('email')} />
					<PasswordInput
						label="Password"
						placeholder="Sua senha"
						required
						{...form.getInputProps('password')}
					/>
					<Button type="submit" fullWidth mt="xl" loading={mutation.isPending}>
						Sign in
					</Button>
				</Stack>
			</form>
		</Paper>
	)
}
