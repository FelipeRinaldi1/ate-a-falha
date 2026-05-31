import { useState } from 'react'
import {
	Container,
	Paper,
	Stack,
	Group,
	Text,
	Button,
	Modal,
	NumberInput,
	Center,
	Loader,
	SimpleGrid,
	Card,
} from '@mantine/core'
import { Pencil } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '../../../components/layout/MainLayout'
import { api } from '../../../api/axiosInstance'
import { type DietDTO } from '@ate-a-falha/shared'
import { DonutChart } from '@mantine/charts'

interface BodyMetric {
	id: string
	weight: number
	height: number
	activityLevel: number
	bodyFat: number | null
	muscleRate: number | null
	createdAt: string
}

export function DietGoalsPage() {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const [opened, setOpened] = useState(false)

	// Fetch active diet plans
	const { data: diets = [], isLoading: isLoadingDiets } = useQuery<DietDTO[]>({
		queryKey: ['diets'],
		queryFn: async () => {
			const res = await api.get('/nutrition/diets')
			return res.data
		},
	})

	// Fetch body metrics to get user weight
	const { data: bodyMetrics = [], isLoading: isLoadingMetrics } = useQuery<BodyMetric[]>({
		queryKey: ['body-metrics'],
		queryFn: async () => {
			const res = await api.get('/users/body-metrics')
			return res.data
		},
	})

	const activeDiet = diets[0]
	const latestMetric = bodyMetrics[0]
	const weight = latestMetric?.weight || 0

	// Local state for editing form
	const [proteinGPerKg, setProteinGPerKg] = useState<number>(2.0)
	const [fatGPerKg, setFatGPerKg] = useState<number>(1.0)
	const [carbGPerKg, setCarbGPerKg] = useState<number>(5.0)
	const [fiberGoal, setFiberGoal] = useState<number>(25)

	const handleOpenEditModal = () => {
		if (activeDiet && weight > 0) {
			setProteinGPerKg(Number((activeDiet.dailyProteinGoal / weight).toFixed(1)))
			setFatGPerKg(Number((activeDiet.dailyFatGoal / weight).toFixed(1)))
			setCarbGPerKg(Number((activeDiet.dailyCarbGoal / weight).toFixed(1)))
			setFiberGoal(activeDiet.dailyFiberGoal || 25)
		} else {
			setProteinGPerKg(2.0)
			setFatGPerKg(1.0)
			setCarbGPerKg(5.0)
			setFiberGoal(25)
		}
		setOpened(true)
	}

	// Calculate dynamic goals based on input
	const calculatedProtein = Number((proteinGPerKg * weight).toFixed(0))
	const calculatedFat = Number((fatGPerKg * weight).toFixed(0))
	const calculatedCarb = Number((carbGPerKg * weight).toFixed(0))
	const calculatedKcal = calculatedProtein * 4 + calculatedCarb * 4 + calculatedFat * 9

	// Mutation: Save Diet Goals (Create or Update)
	const saveDietGoalsMutation = useMutation({
		mutationFn: async () => {
			const payload = {
				name: activeDiet?.name || 'Minha Dieta',
				dailyKcalGoal: calculatedKcal,
				dailyProteinGoal: calculatedProtein,
				dailyCarbGoal: calculatedCarb,
				dailyFatGoal: calculatedFat,
				dailyFiberGoal: fiberGoal,
				dailyWaterGoal: activeDiet?.dailyWaterGoal || 3000,
				dailyWater: activeDiet?.dailyWater || 0,
			}

			if (activeDiet) {
				const res = await api.patch(`/nutrition/diets/${activeDiet.id}`, payload)
				return res.data
			} else {
				const res = await api.post('/nutrition/diets', payload)
				return res.data
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['diets'] })
			setOpened(false)
		},
	})

	if (isLoadingDiets || isLoadingMetrics) {
		return (
			<MainLayout title="Meta Diária" onBack={() => navigate('/nutrition')}>
				<Center style={{ height: '70vh' }}>
					<Loader size="lg" />
				</Center>
			</MainLayout>
		)
	}

	// Targets
	const targetKcal = activeDiet?.dailyKcalGoal || 2000
	const targetProtein = activeDiet?.dailyProteinGoal || 150
	const targetFat = activeDiet?.dailyFatGoal || 60
	const targetCarb = activeDiet?.dailyCarbGoal || 200
	const targetFiber = activeDiet?.dailyFiberGoal || 25

	const pCalGoal = targetProtein * 4
	const cCalGoal = targetCarb * 4
	const fCalGoal = targetFat * 9
	const totalCalGoal = pCalGoal + cCalGoal + fCalGoal

	const protGoalPercent = totalCalGoal > 0 ? Math.round((pCalGoal / totalCalGoal) * 100) : 0
	const carbGoalPercent = totalCalGoal > 0 ? Math.round((cCalGoal / totalCalGoal) * 100) : 0
	const fatGoalPercent = totalCalGoal > 0 ? Math.round((fCalGoal / totalCalGoal) * 100) : 0

	return (
		<MainLayout title="Meta Diária" onBack={() => navigate('/nutrition')}>
			<Container size="xs" px={0}>
				<Stack gap="md">
					{weight === 0 ? (
						<Paper withBorder p="xl" radius="md" shadow="sm" style={{ textAlign: 'center' }}>
							<Stack align="center" gap="md">
								<Text fw={700} size="md">
									Nenhuma pesagem cadastrada
								</Text>
								<Text size="sm" c="dimmed">
									Você precisa cadastrar seu peso corporal no perfil para poder configurar e
									sincronizar suas metas diárias em g/kg.
								</Text>
								<Button onClick={() => navigate('/profile/new-metric')} fullWidth>
									Registrar Peso Corporal
								</Button>
							</Stack>
						</Paper>
					) : (
						<>
							{/* Daily Goals Container */}
							<Paper withBorder p="md" radius="md" shadow="sm" style={{ position: 'relative' }}>
								<Stack gap="md">
									<Group justify="space-between" align="center">
										<Text fw={700} c="dimmed" size="sm">
											Macronutrientes
										</Text>
										<Button
											size="xs"
											variant="light"
											leftSection={<Pencil size={12} />}
											onClick={handleOpenEditModal}
										>
											Editar
										</Button>
									</Group>

									{/* Calories Goal Card */}
									<Card
										withBorder
										p="md"
										radius="md"
										style={{ backgroundColor: 'var(--mantine-color-dark-6)' }}
									>
										<Text size="xs" c="dimmed" fw={700}>
											Meta Diária de Calorias
										</Text>
										<Text size="xl" fw={800} mt={4}>
											{targetKcal} Kal
										</Text>
									</Card>

									{/* Macros detail */}
									<Stack gap="xs">
										<Card withBorder p="sm" radius="md">
											<Group justify="space-between" align="center">
												<Stack gap={0}>
													<Text fw={700} size="sm">
														Proteína
													</Text>
													<Text size="xs" c="dimmed">
														{targetProtein.toFixed(0)}g
													</Text>
												</Stack>
												<Stack gap={0} style={{ textAlign: 'right' }}>
													<Text fw={700} size="sm">
														{weight > 0 ? (targetProtein / weight).toFixed(1) : 0} g/kg
													</Text>
													<Text size="xs" c="dimmed">
														{(targetProtein * 4).toFixed(0)} Kal
													</Text>
												</Stack>
											</Group>
										</Card>

										<Card withBorder p="sm" radius="md">
											<Group justify="space-between" align="center">
												<Stack gap={0}>
													<Text fw={700} size="sm">
														Gordura
													</Text>
													<Text size="xs" c="dimmed">
														{targetFat.toFixed(0)}g
													</Text>
												</Stack>
												<Stack gap={0} style={{ textAlign: 'right' }}>
													<Text fw={700} size="sm">
														{weight > 0 ? (targetFat / weight).toFixed(1) : 0} g/kg
													</Text>
													<Text size="xs" c="dimmed">
														{(targetFat * 9).toFixed(0)} Kal
													</Text>
												</Stack>
											</Group>
										</Card>

										<Card withBorder p="sm" radius="md">
											<Group justify="space-between" align="center">
												<Stack gap={0}>
													<Text fw={700} size="sm">
														Carboidratos
													</Text>
													<Text size="xs" c="dimmed">
														{targetCarb.toFixed(0)}g
													</Text>
												</Stack>
												<Stack gap={0} style={{ textAlign: 'right' }}>
													<Text fw={700} size="sm">
														{weight > 0 ? (targetCarb / weight).toFixed(1) : 0} g/kg
													</Text>
													<Text size="xs" c="dimmed">
														{(targetCarb * 4).toFixed(0)} Kal
													</Text>
												</Stack>
											</Group>
										</Card>

										<Card withBorder p="sm" radius="md">
											<Group justify="space-between" align="center">
												<Stack gap={0}>
													<Text fw={700} size="sm">
														Fibras
													</Text>
													<Text size="xs" c="dimmed">
														{targetFiber.toFixed(0)}g
													</Text>
												</Stack>
												<Stack gap={0} style={{ textAlign: 'right' }}>
													<Text fw={700} size="sm">
														Meta diária
													</Text>
													<Text size="xs" c="dimmed">
														Sem valor calórico direto
													</Text>
												</Stack>
											</Group>
										</Card>
									</Stack>
								</Stack>
							</Paper>

							{/* Daily Goals Chart Container */}
							<Paper withBorder p="md" radius="md" shadow="sm">
								<Stack gap="md" align="center">
									<Group w="100%" justify="flex-start">
										<Text fw={700} c="dimmed" size="sm">
											Distribuição da Meta Diária (Macronutrientes)
										</Text>
									</Group>

									<DonutChart
										data={[
											{ name: 'Proteínas', value: pCalGoal, color: 'red' },
											{ name: 'Carboidratos', value: cCalGoal, color: 'yellow' },
											{ name: 'Gorduras', value: fCalGoal, color: 'green' },
										]}
										withTooltip={false}
										size={160}
										thickness={20}
									/>

									<SimpleGrid cols={3} spacing="xs" w="100%" mt="sm">
										<Card withBorder p="xs" radius="md" style={{ textAlign: 'center' }}>
											<Text size="xs" fw={700} c="red">
												Proteínas
											</Text>
											<Text size="sm" fw={700}>
												{protGoalPercent}%
											</Text>
											<Text size="xs" c="dimmed">
												{pCalGoal.toFixed(0)} Kal
											</Text>
										</Card>
										<Card withBorder p="xs" radius="md" style={{ textAlign: 'center' }}>
											<Text size="xs" fw={700} c="yellow">
												Carboidratos
											</Text>
											<Text size="sm" fw={700}>
												{carbGoalPercent}%
											</Text>
											<Text size="xs" c="dimmed">
												{cCalGoal.toFixed(0)} Kal
											</Text>
										</Card>
										<Card withBorder p="xs" radius="md" style={{ textAlign: 'center' }}>
											<Text size="xs" fw={700} c="green">
												Gorduras
											</Text>
											<Text size="sm" fw={700}>
												{fatGoalPercent}%
											</Text>
											<Text size="xs" c="dimmed">
												{fCalGoal.toFixed(0)} Kal
											</Text>
										</Card>
									</SimpleGrid>
								</Stack>
							</Paper>
						</>
					)}
				</Stack>
			</Container>

			{/* Edit Goals Modal */}
			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title="Configurar Metas de Macronutrientes"
				centered
				radius="md"
			>
				<Stack gap="md">
					<Text size="xs" c="dimmed">
						Abaixo, insira os valores multiplicadores (g/kg) de cada macronutriente com base no seu peso
						atual de <strong>{weight} kg</strong>.
					</Text>

					<NumberInput
						label="Proteína (g/kg)"
						placeholder="Ex: 2.0"
						min={0.1}
						step={0.1}
						decimalScale={1}
						required
						value={proteinGPerKg}
						onChange={(val) => setProteinGPerKg(Number(val) || 0)}
					/>

					<NumberInput
						label="Gordura (g/kg)"
						placeholder="Ex: 1.0"
						min={0.1}
						step={0.1}
						decimalScale={1}
						required
						value={fatGPerKg}
						onChange={(val) => setFatGPerKg(Number(val) || 0)}
					/>

					<NumberInput
						label="Carboidratos (g/kg)"
						placeholder="Ex: 5.0"
						min={0.1}
						step={0.1}
						decimalScale={1}
						required
						value={carbGPerKg}
						onChange={(val) => setCarbGPerKg(Number(val) || 0)}
					/>

					<NumberInput
						label="Fibras (g)"
						placeholder="Ex: 25"
						min={1}
						step={1}
						required
						value={fiberGoal}
						onChange={(val) => setFiberGoal(Number(val) || 0)}
					/>

					<Paper withBorder p="sm" radius="md" style={{ backgroundColor: 'var(--mantine-color-dark-6)' }}>
						<Stack gap="xs">
							<Text size="xs" fw={700} c="dimmed">
								Metas Calculadas
							</Text>
							<Group justify="space-between">
								<Text size="xs">Proteínas:</Text>
								<Text size="xs" fw={700}>
									{calculatedProtein}g ({calculatedProtein * 4} Kal)
								</Text>
							</Group>
							<Group justify="space-between">
								<Text size="xs">Gorduras:</Text>
								<Text size="xs" fw={700}>
									{calculatedFat}g ({calculatedFat * 9} Kal)
								</Text>
							</Group>
							<Group justify="space-between">
								<Text size="xs">Carboidratos:</Text>
								<Text size="xs" fw={700}>
									{calculatedCarb}g ({calculatedCarb * 4} Kal)
								</Text>
							</Group>
							<Group justify="space-between">
								<Text size="xs">Fibras:</Text>
								<Text size="xs" fw={700}>
									{fiberGoal}g
								</Text>
							</Group>
							<Group
								justify="space-between"
								style={{ borderTop: '1px solid var(--mantine-color-dark-4)', paddingTop: '4px' }}
							>
								<Text size="sm" fw={700}>
									Total diário estimado:
								</Text>
								<Text size="sm" fw={800} color="teal">
									{calculatedKcal} Kal
								</Text>
							</Group>
						</Stack>
					</Paper>

					<Button
						onClick={() => saveDietGoalsMutation.mutate()}
						loading={saveDietGoalsMutation.isPending}
						fullWidth
						mt="xs"
					>
						Salvar Configuração
					</Button>
				</Stack>
			</Modal>
		</MainLayout>
	)
}
