import { useForm, schemaResolver } from '@mantine/form'
import { TextInput, PasswordInput, Button, Stack, Paper, Select } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useMutation } from '@tanstack/react-query'
import { api } from '../../../api/axiosInstance.js'
import { createUserWithAuthSchema, type CreateUserWithAuthDTO } from '@ate-a-falha/shared'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export function RegisterForm() {
	const navigate = useNavigate()
	const { login } = useAuth()

	const form = useForm<CreateUserWithAuthDTO>({
		initialValues: {
			name: '',
			birthDate: new Date(),
			gender: 'MALE',
			role: 'USER',
			auth: {
				email: '',
				password: '',
			},
		},
		validate: schemaResolver(createUserWithAuthSchema, { sync: true }),
	})

	const mutation = useMutation({
		mutationFn: (data: CreateUserWithAuthDTO) => {
			return api.post('/user/register', data)
		},
		onSuccess: (response) => {
			console.log('Register success:', response.data)
			login(response.data.user)
			navigate('/')
		},
		onError: (error) => {
			console.error('Register error:', error)
		},
	})

	return (
		<Paper withBorder shadow="md" p={30} mt={30} radius="md">
			<form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
				<Stack>
					<TextInput label="Nome" placeholder="Nome completo" required {...form.getInputProps('name')} />

					<TextInput
						label="Email"
						placeholder="seu@email.com"
						required
						{...form.getInputProps('auth.email')}
					/>

					<PasswordInput
						label="Senha"
						placeholder="Senha"
						required
						{...form.getInputProps('auth.password')}
					/>

					<DatePickerInput
						label="Data de Nascimento"
						placeholder="Selecione"
						required
						{...form.getInputProps('birthDate')}
					/>

					<Select
						label="Gênero"
						placeholder="Selecione"
						data={[
							{ value: 'MALE', label: 'Masculino' },
							{ value: 'FEMALE', label: 'Feminino' },
						]}
						required
						{...form.getInputProps('gender')}
					/>

					<Button type="submit" fullWidth mt="xl" loading={mutation.isPending}>
						Criar Conta
					</Button>
				</Stack>
			</form>
		</Paper>
	)
}
