import { Button, NumberInput, Paper, Select, Stack, Loader, Center, Alert } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { type CreateBodyMetricDTO, createBodyMetricSchema } from '@ate-a-falha/shared'
import { useAuth } from '../../hooks/useAuth'
import { useBodyMetrics, useCreateBodyMetric } from '../../hooks/useUser'
import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { translateError } from '../../../../utils/errorTranslator'
import { useGoBack } from '../../../../utils/navigation'
import type { AxiosError } from 'axios'

export function NewBodyMetricForm() {
	const goBack = useGoBack('/profile')
	const { refreshUser } = useAuth()
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
			form.setValues({
				weight: 0,
				height: latest.height,
				activityLevel: latest.activityLevel,
				bodyFat: latest.bodyFat ?? null,
				muscleRate: latest.muscleRate ?? null,
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [metrics])

	const baseMutation = useCreateBodyMetric({
		onSuccess: async () => {
			await refreshUser()
			goBack('/profile')
		},
		onError: (error: AxiosError) => {
			setErrorMsg(translateError(error, 'Erro ao registrar nova pesagem.'))
		},
	})

	const mutation = {
		...baseMutation,
		mutate: (data: CreateBodyMetricDTO) => {
			setErrorMsg(null)
			baseMutation.mutate(data)
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
						<Alert
							variant="light"
							color="red"
							title="Erro ao registrar pesagem"
							icon={<AlertCircle size={16} />}
						>
							{errorMsg}
						</Alert>
					)}
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
