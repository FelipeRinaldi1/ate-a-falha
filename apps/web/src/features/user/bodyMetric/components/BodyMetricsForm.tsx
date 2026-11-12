import { Button, NumberInput, Paper, Select, Stack, Alert } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { type CreateBodyMetricDTO, createBodyMetricSchema } from '@ate-a-falha/shared'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCreateBodyMetric } from '../../hooks/useUser'
import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { translateError } from '../../../../utils/errorTranslator'
import type { AxiosError } from 'axios'

export function BodyMetricRegisterForm() {
	const navigate = useNavigate()
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
	const mutation = useCreateBodyMetric({
		onSuccess: async () => {
			await refreshUser()
			navigate('/workout', { replace: true })
		},
		onError: (error: AxiosError) => {
			setErrorMsg(translateError(error, 'Erro ao registrar métricas corporais.'))
		},
	})
	return (
		<Paper withBorder shadow="md" p={30} radius="md">
			<form
				onSubmit={form.onSubmit((values) => {
					setErrorMsg(null)
					mutation.mutate({
						...values,
						bodyFat: (values.bodyFat as unknown) === '' ? null : (values.bodyFat ?? null),
						muscleRate: (values.muscleRate as unknown) === '' ? null : (values.muscleRate ?? null),
					})
				})}
			>
				<Stack>
					{errorMsg && (
						<Alert
							variant="light"
							color="red"
							title="Erro ao salvar métricas"
							icon={<AlertCircle size={16} />}
						>
							{errorMsg}
						</Alert>
					)}

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
