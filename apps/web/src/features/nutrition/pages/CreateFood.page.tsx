import { api } from '../../../api/axiosInstance'
import { MainLayout } from '../../../components/layout/MainLayout'
import { useForm } from '@mantine/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Paper, Stack, Group, Text, Title, TextInput, NumberInput, Button, Container, Alert } from '@mantine/core'
import { NutritionLogic, type CreateFoodDTO } from '@ate-a-falha/shared'
import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { translateError } from '../../../utils/errorTranslator'
import type { AxiosError } from 'axios'

interface FoodFormValues extends Omit<CreateFoodDTO, 'calories'> {
	quantity: number
}

export function CreateFoodPage() {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const [errorMsg, setErrorMsg] = useState<string | null>(null)

	const form = useForm<FoodFormValues>({
		initialValues: {
			name: '',
			quantity: 100,
			protein: 0,
			carbohydrate: 0,
			lipids: 0,
			fiber: 0,
		},
		validate: {
			name: (value) => (value.trim().length > 0 ? null : 'Nome é obrigatório'),
			quantity: (value) => (value > 0 ? null : 'Quantidade deve ser maior que 0'),
			protein: (value) => (value >= 0 ? null : 'Não pode ser negativo'),
			carbohydrate: (value) => (value >= 0 ? null : 'Não pode ser negativo'),
			lipids: (value) => (value >= 0 ? null : 'Não pode ser negativo'),
			fiber: (value) => (value >= 0 ? null : 'Não pode ser negativo'),
		},
	})

	const protein = form.values.protein || 0
	const carbohydrate = form.values.carbohydrate || 0
	const lipids = form.values.lipids || 0
	const fiber = form.values.fiber || 0
	const calculatedCalories = NutritionLogic.calculateCalories(protein, carbohydrate, lipids, fiber)

	const mutation = useMutation({
		mutationFn: async (values: FoodFormValues) => {
			const foodData: CreateFoodDTO = {
				name: values.name,
				protein: values.protein || 0,
				carbohydrate: values.carbohydrate || 0,
				lipids: values.lipids || 0,
				fiber: values.fiber || 0,
				calories: calculatedCalories,
			}
			return api.post('/nutrition/food-catalog', foodData)
		},
		onMutate: () => {
			setErrorMsg(null)
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['food-catalog'] })
			navigate(-1)
		},
		onError: (error: AxiosError) => {
			setErrorMsg(translateError(error, 'Erro ao criar alimento.'))
		},
	})

	return (
		<MainLayout title="Criar Alimento" onBack={() => navigate(-1)}>
			<Container size="xs" px={0}>
				<Stack gap="md">
					<Paper withBorder p="md" shadow="sm" radius="md">
						<Stack gap="md">
							<Group justify="space-between" align="center">
								<Title order={2} size="h3" style={{ letterSpacing: '-0.5px' }}>
									Alimento
								</Title>
								<Text fw={700} size="lg" c="dimmed">
									{calculatedCalories.toFixed(0)} Kal
								</Text>
							</Group>

							<form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
								<Stack gap="sm">
									{errorMsg && (
										<Alert variant="light" color="red" title="Erro" icon={<AlertCircle size={16} />}>
											{errorMsg}
										</Alert>
									)}
									<TextInput
										label="Nome Alimento"
										placeholder="Ex: Arroz Integral"
										required
										{...form.getInputProps('name')}
									/>


									<NumberInput
										label="Quantidade de Referência (g)"
										required
										value={100}
										disabled
										description="Os valores nutricionais abaixo devem ser informados para cada 100g do alimento."
									/>

									<Group grow>
										<NumberInput
											label="Proteina (g)"
											placeholder="0"
											min={0}
											decimalScale={2}
											{...form.getInputProps('protein')}
										/>
										<NumberInput
											label="Carboidrato (g)"
											placeholder="0"
											min={0}
											decimalScale={2}
											{...form.getInputProps('carbohydrate')}
										/>
									</Group>

									<Group grow>
										<NumberInput
											label="Gordura (g)"
											placeholder="0"
											min={0}
											decimalScale={2}
											{...form.getInputProps('lipids')}
										/>
										<NumberInput
											label="Fibra (g)"
											placeholder="0"
											min={0}
											decimalScale={2}
											{...form.getInputProps('fiber')}
										/>
									</Group>

									<Button
										type="submit"
										loading={mutation.isPending}
										fullWidth
										mt="lg"
										size="md"
										radius="md"
									>
										Criar Alimento
									</Button>
								</Stack>
							</form>
						</Stack>
					</Paper>
				</Stack>
			</Container>
		</MainLayout>
	)
}
