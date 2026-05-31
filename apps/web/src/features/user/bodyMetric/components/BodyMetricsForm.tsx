import { api } from '../../../../api/axiosInstance'
import { Button, NumberInput, Paper, Select, Stack } from '@mantine/core'

import { schemaResolver, useForm } from '@mantine/form'
import { type CreateBodyMetricDTO, createBodyMetricSchema } from '@ate-a-falha/shared'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function BodyMetricRegisterForm() {
	const navigate = useNavigate()
	const { refreshUser } = useAuth()

	const form = useForm<CreateBodyMetricDTO>({
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
		mutationFn: (data: CreateBodyMetricDTO) => {
			return api.post('/users/body-metrics', data)
		},
		onSuccess: async (response: any) => {
			await refreshUser()
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
