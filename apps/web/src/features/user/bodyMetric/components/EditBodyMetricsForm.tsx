import { useState, useEffect } from 'react'
import { Button, NumberInput, Paper, Select, Stack, Loader, Center, Alert } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { type CreateBodyMetricDTO, createBodyMetricSchema } from '@ate-a-falha/shared'
import { useAuth } from '../../hooks/useAuth'
import { useBodyMetrics, useCreateBodyMetric, useUpdateBodyMetric, useDeleteBodyMetric } from '../../hooks/useUser'
import { AlertCircle } from 'lucide-react'
import { translateError } from '../../../../utils/errorTranslator'
import { useGoBack } from '../../../../utils/navigation'
import type { AxiosError } from 'axios'

export function EditBodyMetricsForm() {
	const goBack = useGoBack('/profile')
	const { refreshUser } = useAuth()
	const [metricId, setMetricId] = useState<string | null>(null)
	const [errorMsg, setErrorMsg] = useState<string | null>(null)

	const form = useForm<CreateBodyMetricDTO>({
		initialValues: {
			weight: 0,
			height: 0,
			activityLevel: 0,
			bodyFat: null,
			muscleRate: null,
		},
		validate: schemaResolver(createBodyMetricSchema, { sync: true }),
	})

	const { data: metrics, isLoading } = useBodyMetrics()

	useEffect(() => {
		const latest = metrics?.[0]
		if (latest) {
			setMetricId(latest.id)
			form.setValues({
				weight: latest.weight,
				height: latest.height,
				activityLevel: latest.activityLevel,
				bodyFat: latest.bodyFat ?? null,
				muscleRate: latest.muscleRate ?? null,
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [metrics])

	const createMutation = useCreateBodyMetric({
		onSuccess: async () => {
			await refreshUser()
			goBack('/profile')
		},
		onError: (error: AxiosError) => {
			setErrorMsg(translateError(error, 'Erro ao atualizar métricas corporais.'))
		},
	})

	const updateMutation = useUpdateBodyMetric({
		onSuccess: async () => {
			await refreshUser()
			goBack('/profile')
		},
		onError: (error: AxiosError) => {
			setErrorMsg(translateError(error, 'Erro ao atualizar métricas corporais.'))
		},
	})

	const mutation = {
		isPending: createMutation.isPending || updateMutation.isPending,
		mutate: (data: CreateBodyMetricDTO) => {
			setErrorMsg(null)
			if (!metricId) {
				createMutation.mutate(data)
			} else {
				updateMutation.mutate({ id: metricId, data })
			}
		},
	}

	const deleteBaseMutation = useDeleteBodyMetric({
		onSuccess: async () => {
			await refreshUser()
			goBack('/profile')
		},
		onError: (error: AxiosError) => {
			setErrorMsg(translateError(error, 'Erro ao excluir métricas corporais.'))
		},
	})

	const deleteMutation = {
		...deleteBaseMutation,
		mutate: () => {
			setErrorMsg(null)
			if (!metricId) {
				setErrorMsg('Nenhum registro para excluir')
				return
			}
			deleteBaseMutation.mutate(metricId)
		},
	}

	if (isLoading) {
		return (
			<Center style={{ height: '30vh' }}>
				<Loader size="lg" />
			</Center>
		)
	}

	return (
		<Paper withBorder p="xl" radius="md" shadow="sm">
			<form
				onSubmit={form.onSubmit((values) =>
					mutation.mutate({
						...values,
						bodyFat: (values.bodyFat as unknown) === '' ? null : (values.bodyFat ?? null),
						muscleRate: (values.muscleRate as unknown) === '' ? null : (values.muscleRate ?? null),
					})
				)}
			>
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
