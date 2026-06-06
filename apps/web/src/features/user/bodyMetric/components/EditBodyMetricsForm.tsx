import { useState } from 'react'
import { api } from '../../../../api/axiosInstance'
import { Button, NumberInput, Paper, Select, Stack, Loader, Center, Alert } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { type CreateBodyMetricDTO, createBodyMetricSchema } from '@ate-a-falha/shared'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { AlertCircle } from 'lucide-react'
import { translateError } from '../../../../utils/errorTranslator'
import type { AxiosError } from 'axios'

interface BodyMetric {
	id: string
	weight: number
	height: number
	activityLevel: number
	bodyFat: number | null
	muscleRate: number | null
	createdAt: string
}

export function EditBodyMetricsForm() {
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const { refreshUser } = useAuth()
	const [metricId, setMetricId] = useState<string | null>(null)
	const [errorMsg, setErrorMsg] = useState<string | null>(null)

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
				setMetricId(latest.id)
				form.setValues({
					weight: latest.weight,
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
			if (!metricId) {
				return api.post('/users/body-metrics', data)
			}
			return api.patch(`/users/body-metrics/${metricId}`, data)
		},
		onMutate: () => {
			setErrorMsg(null)
		},
		onSuccess: async () => {
			await refreshUser()
			await queryClient.invalidateQueries({ queryKey: ['body-metrics'] })
			navigate('/profile')
		},
		onError: (error: AxiosError) => {
			setErrorMsg(translateError(error, 'Erro ao atualizar métricas corporais.'))
		},
	})

	const deleteMutation = useMutation({
		mutationFn: () => {
			if (!metricId) return Promise.reject(new Error('Nenhum registro para excluir'))
			return api.delete(`/users/body-metrics/${metricId}`)
		},
		onMutate: () => {
			setErrorMsg(null)
		},
		onSuccess: async () => {
			await refreshUser()
			await queryClient.invalidateQueries({ queryKey: ['body-metrics'] })
			navigate('/profile')
		},
		onError: (error: AxiosError) => {
			setErrorMsg(translateError(error, 'Erro ao excluir métricas corporais.'))
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
					{errorMsg && (
						<Alert variant="light" color="red" title="Erro" icon={<AlertCircle size={16} />}>
							{errorMsg}
						</Alert>
					)}
					<NumberInput
						label="Altura (cm)"
						placeholder="175cm"
						required
						min={1}
						{...form.getInputProps('height')}
					></NumberInput>

					<NumberInput
						label="Peso (kg)"
						placeholder="60kg"
						required
						min={1}
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
						min={0}
						max={50}
						{...form.getInputProps('bodyFat')}
					></NumberInput>
					<NumberInput
						label="% de Massa Muscular"
						placeholder="37"
						min={0}
						max={100}
						{...form.getInputProps('muscleRate')}
					></NumberInput>

					<Button type="submit" loading={mutation.isPending} fullWidth mt="md">
						Salvar Alterações
					</Button>

					{metricId && (
						<Button
							variant="outline"
							color="red"
							onClick={() => {
								if (window.confirm('Deseja realmente excluir este registro de métrica corporal?')) {
									deleteMutation.mutate()
								}
							}}
							loading={deleteMutation.isPending}
							fullWidth
						>
							Excluir Métricas
						</Button>
					)}
				</Stack>
			</form>
		</Paper>
	)
}
