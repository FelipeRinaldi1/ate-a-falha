import { useForm, schemaResolver } from '@mantine/form'
import { TextInput, PasswordInput, Button, Stack, Paper, Alert } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { api } from '../../../api/axiosInstance.js'
import { loginSchema, type LoginDTO } from '@ate-a-falha/shared'
import { useAuth } from '../hooks/useAuth.js'
import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { translateError } from '../../../utils/errorTranslator'
import type { AxiosError } from 'axios'

export function LoginForm() {
	const { login } = useAuth()
	const [errorMsg, setErrorMsg] = useState<string | null>(null)

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
		onMutate: () => {
			setErrorMsg(null)
		},
		onSuccess: (response) => {
			login(response.data.user)
		},
		onError: (error: AxiosError) => {
			setErrorMsg(translateError(error, 'E-mail ou senha incorretos.'))
		},
	})

	return (
		<Paper withBorder shadow="md" p={30} mt={30} radius="md">
			<form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
				<Stack>
					{errorMsg && (
						<Alert variant="light" color="red" title="Erro de Login" icon={<AlertCircle size={16} />}>
							{errorMsg}
						</Alert>
					)}
					<TextInput label="Email" placeholder="seu@email.com" required {...form.getInputProps('email')} />
					<PasswordInput
						label="Senha"
						placeholder="Sua senha"
						required
						{...form.getInputProps('password')}
					/>
					<Button type="submit" fullWidth mt="xl" loading={mutation.isPending}>
						Entrar
					</Button>
				</Stack>
			</form>
		</Paper>
	)
}

