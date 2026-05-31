import { api } from '../../../../api/axiosInstance'
import { Button, NumberInput, Paper, Select, Stack, Loader, Center } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { type CreateBodyMetricDTO, createBodyMetricSchema } from '@ate-a-falha/shared'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface BodyMetric {
	id: string
	weight: number
	height: number
	activityLevel: number
	bodyFat: number | null
	muscleRate: number | null
	createdAt: string
}

export function NewBodyMetricForm() {
	const queryClient = useQueryClient()
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

	const { isLoading } = useQuery<BodyMetric[]>({
		queryKey: ['body-metrics'],
		queryFn: async () => {
			const response = await api.get('/users/body-metrics')
			const latest = response.data[0]
			if (latest) {
				form.setValues({
					weight: 0, // Force user to enter new weight
					height: latest.height,
					activityLevel: latest.activityLevel,
					bodyFat: latest.bodyFat ?? 0,
					muscleRate: latest.muscleRate ?? 0,
				})
			}
			return response.data
		},
	})

	const mutation = useMutation({
		mutationFn: (data: CreateBodyMetricDTO) => {
			return api.post('/users/body-metrics', data)
		},
		onSuccess: async (response: any) => {
			await refreshUser()
			await queryClient.invalidateQueries({ queryKey: ['body-metrics'] })
			console.log('Register new body-metric success:', response.data)
			navigate('/profile')
		},
		onError: (error) => {
			console.error('Register new body-metric error:', error)
		},
	})

	if (isLoading) {
		return (
			<Center style={{ height: '30vh' }}>
				<Loader size="lg" />
			</Center>
		)
	}

	return (
		<Paper withBorder p="xl" radius="md" shadow="sm">
			<form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
				<Stack gap="md">
					<NumberInput
						label="Peso Atual (kg)"
						placeholder="Digite seu peso"
						required
						min={1}
						{...form.getInputProps('weight')}
					></NumberInput>
					<NumberInput
						label="Altura (cm) - Prefixado"
						placeholder="175cm"
						required
						min={1}
						{...form.getInputProps('height')}
					></NumberInput>
					<Select
						label="Nível de atividade - Prefixado"
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
						label="% de Gordura Corporal (Opcional)"
						placeholder="15"
						min={0}
						max={50}
						{...form.getInputProps('bodyFat')}
					></NumberInput>
					<NumberInput
						label="% de Massa Muscular (Opcional)"
						placeholder="37"
						min={0}
						max={100}
						{...form.getInputProps('muscleRate')}
					></NumberInput>

					<Button type="submit" loading={mutation.isPending} fullWidth mt="md">
						Registrar Pesagem
					</Button>
				</Stack>
			</form>
		</Paper>
	)
}
