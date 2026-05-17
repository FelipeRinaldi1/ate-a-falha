import { api } from '../api/axiosInstance'
import { Button, Center, Container, NumberInput, Paper, Select, Stack, Title } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { type CreateBodyMetricDTO, createBodyMetricSchema } from '@ate-a-falha/shared'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
type bodyMetricFormValues = Omit<CreateBodyMetricDTO, 'userId'>

function BodyMetricRegisterForm() {
	const navigate = useNavigate()

	const form = useForm<bodyMetricFormValues>({
		initialValues: {
			weight: 0,
			height: 0,
			activityLevel: 0,
			bodyFat: 0,
			muscleRate: 0,
		},
		validate: schemaResolver(createBodyMetricSchema, { sync: true }),
	})
	const mutation = useMutation({
		mutationFn: (data: bodyMetricFormValues) => {
			return api.post('/user/body-metric', data)
		},
		onSuccess: (response) => {
			console.log('Register body-metrics success:', response.data)
			navigate('/')
		},
		onError: (error) => {
			console.error('Register body-metrics error:', error)
		},
	})

	return (
		<Paper>
			<form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
				<Stack>
					<NumberInput
						label="Altura (cm)"
						placeholder="175cm"
						required
						{...form.getInputProps('height')}
					></NumberInput>
					<NumberInput
						label="Peso (kg)"
						placeholder="60kg"
						required
						{...form.getInputProps('weight')}
					></NumberInput>
					<Select
						label="Nível de atividade"
						placeholder="Selecione"
						data={[
							{ value: '0', label: 'Sedentário' },
							{ value: '1', label: 'Leve' },
							{ value: '2', label: 'Moderado' },
							{ value: '3', label: 'Intenso' },
							{ value: '4', label: 'Muito intenso' },
						]}
						required
						{...form.getInputProps('activityLevel')}
						value={String(form.values.activityLevel)}
						onChange={(val) => form.setFieldValue('activityLevel', Number(val))}
					></Select>
					<NumberInput
						label="% de Gordura Corporal"
						placeholder="15"
						{...form.getInputProps('bodyFat')}
					></NumberInput>
					<NumberInput
						label="% de Massa Muscular"
						placeholder="37"
						{...form.getInputProps('muscleRate')}
					></NumberInput>

					<Button type="submit">Criar registro</Button>
				</Stack>
			</form>
		</Paper>
	)
}

export function BodyMetricRegisterPage() {
	return (
		<Center>
			<Container>
				<Title>Criar registros corporais</Title>
				<BodyMetricRegisterForm />
			</Container>
		</Center>
	)
}
