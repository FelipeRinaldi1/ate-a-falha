import { useForm, schemaResolver } from '@mantine/form'
import { TextInput, PasswordInput, Button, Stack, Paper, Select, Alert } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { createUserWithAuthSchema, type CreateUserWithAuthDTO } from '@ate-a-falha/shared'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useRegister } from '../hooks/useUser'
import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { translateError } from '../../../utils/errorTranslator'
import type { AxiosError } from 'axios'

export function RegisterForm() {
	const navigate = useNavigate()
	const { login } = useAuth()
	const [errorMsg, setErrorMsg] = useState<string | null>(null)

	const form = useForm<CreateUserWithAuthDTO>({
		initialValues: {
			name: '',
			birthDate: new Date(),
			gender: 'MALE',
			auth: {
				email: '',
				password: '',
			},
		},
		validate: schemaResolver(createUserWithAuthSchema, { sync: true }),
	})

	const mutation = useRegister({
		onSuccess: (data) => {
			login(data.user)
			navigate('/setup-metrics', { replace: true })
		},
		onError: (error: AxiosError) => {
			setErrorMsg(translateError(error, 'Erro ao registrar usuário. Tente novamente.'))
		},
	})

	return (
		<Paper withBorder shadow="md" p={30} mt={30} radius="md">
			<form
				onSubmit={form.onSubmit((values) => {
					setErrorMsg(null)
					mutation.mutate(values)
				})}
			>
				<Stack>
					{errorMsg && (
						<Alert variant="light" color="red" title="Erro de Cadastro" icon={<AlertCircle size={16} />}>
							{errorMsg}
						</Alert>
					)}
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
							{ value: 'OTHER', label: 'Outro' },
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
