import { Center, Paper, Stack, Group, Text, Title, Avatar, Button, Loader, RingProgress } from '@mantine/core'
import { MainLayout } from '../../../components/layout/MainLayout'
import { Flame, Ruler, Scale, Weight, Edit, Plus, Info, TrendingUp } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../../../api/axiosInstance'
import { BodyMetricLogic } from '@ate-a-falha/shared'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

interface BodyMetric {
	id: string
	weight: number
	height: number
	activityLevel: number
	bodyFat: number | null
	muscleRate: number | null
	createdAt: string
}

const activityLevelLabels = ['Sedentário', 'Leve', 'Moderado', 'Intenso', 'Muito intenso']

const getBmiCategory = (bmi: number) => {
	if (bmi < 18.5) return { label: 'Abaixo do peso', color: 'blue' }
	if (bmi < 25) return { label: 'Peso normal', color: 'green' }
	if (bmi < 30) return { label: 'Sobrepeso', color: 'orange' }
	return { label: 'Obesidade', color: 'red' }
}

export function ProfilePage() {
	const { user } = useAuth()
	const navigate = useNavigate()

	const { data: metrics = [], isLoading } = useQuery<BodyMetric[]>({
		queryKey: ['body-metrics'],
		queryFn: async () => {
			const response = await api.get('/users/body-metrics')
			return response.data
		},
		enabled: !!user,
	})

	if (!user || isLoading) {
		return (
			<MainLayout showSearch={false}>
				<Center style={{ height: '50vh' }}>
					<Loader size="xl" />
				</Center>
			</MainLayout>
		)
	}

	const latestMetric = metrics && metrics.length > 0 ? metrics[0] : null

	const age = user.birthDate
		? (() => {
				const today = new Date()
				const birth = new Date(user.birthDate)
				let calculatedAge = today.getFullYear() - birth.getFullYear()
				const m = today.getMonth() - birth.getMonth()
				if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
					calculatedAge--
				}
				return calculatedAge
			})()
		: 0

	const bmi = latestMetric ? BodyMetricLogic.calculateBMI(latestMetric.weight, latestMetric.height / 100) : 0
	const bmr = latestMetric
		? BodyMetricLogic.calculateBMR(
				user.gender === 'FEMALE' ? 'FEMALE' : 'MALE',
				latestMetric.weight,
				latestMetric.height,
				age
			)
		: 0
	const tdee = latestMetric ? BodyMetricLogic.calculateTDEE(bmr, latestMetric.activityLevel) : 0

	const bmiInfo = getBmiCategory(bmi)

	const bodyFat = latestMetric?.bodyFat ?? null
	const muscleRate = latestMetric?.muscleRate ?? null

	return (
		<MainLayout showSearch={false}>
			<Paper withBorder={true} p="xl" w="100%" maw={600} mx="auto" shadow={'xl'} style={{ borderRadius: '16px' }}>
				<Stack align="stretch" justify="flex-start" gap="lg">
					<Center style={{ position: 'relative' }}>
						<Avatar
							size={128}
							alt={user.name}
							color="blue"
							radius="xl"
							style={{
								fontSize: '48px',
								fontWeight: 'bold',
								boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
								border: '4px solid #fff',
							}}
						>
							{user.name.substring(0, 2).toUpperCase()}
						</Avatar>
					</Center>

					<Stack align="center" gap={4}>
						<Title order={1} style={{ letterSpacing: '-0.5px' }}>
							{user.name}
						</Title>
						<Text size="sm" c="dimmed">
							{user.email}
						</Text>
					</Stack>

					{!latestMetric ? (
						<Paper
							withBorder={true}
							w="100%"
							p="xl"
							shadow="md"
							style={{
								borderRadius: '12px',
								background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
								border: 'none',
								textAlign: 'center',
							}}
						>
							<Stack align="center" gap="md">
								<Info size={40} color="#4A5568" />
								<Title order={3} c="dark">
									Nenhuma métrica cadastrada
								</Title>
								<Text size="sm" c="gray.7" style={{ maxWidth: '400px' }}>
									Cadastre suas métricas corporais agora para calcular seu IMC, Gasto Metabólico Basal
									(BMR), e Gasto Metabólico Diário (TDEE).
								</Text>
								<Button
									leftSection={<Plus size={16} />}
									size="md"
									radius="md"
									onClick={() => navigate('/setup-metrics')}
								>
									Cadastrar Métricas
								</Button>
							</Stack>
						</Paper>
					) : (
						<>
							<Group gap="sm" justify="center">
								<Button
									variant="outline"
									leftSection={<TrendingUp size={16} />}
									onClick={() => navigate('/profile/evolution')}
									radius="md"
								>
									Gráficos de Evolução
								</Button>
								<Button
									variant="filled"
									leftSection={<Plus size={16} />}
									onClick={() => navigate('/profile/new-metric')}
									radius="md"
								>
									Registrar Peso
								</Button>
							</Group>

							<Paper withBorder={true} w="100%" p="lg" shadow="sm" style={{ borderRadius: '12px' }}>
								<Stack align="stretch" justify="flex-start" gap="md">
									<Group justify="space-between">
										<Title order={3} size={'h4'}>
											Métricas Corporais
										</Title>
										<Button
											variant="light"
											leftSection={<Edit size={14} />}
											size="xs"
											radius="md"
											onClick={() => navigate('/profile/edit-metrics')}
										>
											Editar
										</Button>
									</Group>

									<Group grow gap="md">
										<Paper withBorder p="sm" style={{ borderRadius: '8px', textAlign: 'center' }}>
											<Stack align="center" gap={4}>
												<Ruler size={24} color="#228BE6" />
												<Text size="xs" c="dimmed">
													Altura
												</Text>
												<Text size="lg" fw={700}>
													{latestMetric.height} cm
												</Text>
											</Stack>
										</Paper>

										<Paper withBorder p="sm" style={{ borderRadius: '8px', textAlign: 'center' }}>
											<Stack align="center" gap={4}>
												<Weight size={24} color="#12B886" />
												<Text size="xs" c="dimmed">
													Peso
												</Text>
												<Text size="lg" fw={700}>
													{latestMetric.weight} kg
												</Text>
											</Stack>
										</Paper>

										<Paper withBorder p="sm" style={{ borderRadius: '8px', textAlign: 'center' }}>
											<Stack align="center" gap={4}>
												<Scale size={24} color="#FD7E14" />
												<Text size="xs" c="dimmed">
													IMC
												</Text>
												<Text size="lg" fw={700}>
													{bmi}
												</Text>
											</Stack>
										</Paper>
									</Group>

									<Group justify="center" mt="xs">
										<Text size="sm" fw={500} c="dimmed">
											Classificação do IMC:{' '}
											<Text component="span" fw={700} color={bmiInfo.color}>
												{bmiInfo.label}
											</Text>
										</Text>
									</Group>
								</Stack>
							</Paper>

							<Paper withBorder={true} w="100%" p="lg" shadow="sm" style={{ borderRadius: '12px' }}>
								<Stack align="stretch" justify="flex-start" gap="md">
									<Title order={3} size={'h4'}>
										Gasto Calórico
									</Title>

									<Stack gap="xs">
										<Group justify="space-between">
											<Group gap="xs">
												<Flame size={20} color="#E03131" />
												<Text size="sm" fw={500}>
													Nível de atividade física
												</Text>
											</Group>
											<Text size="sm" fw={600}>
												{activityLevelLabels[latestMetric.activityLevel] ?? 'Desconhecido'}
											</Text>
										</Group>

										<Group justify="space-between">
											<Group gap="xs">
												<Flame size={20} color="#FA5252" />
												<Text size="sm" fw={500}>
													Gasto Metabólico Basal (BMR)
												</Text>
											</Group>
											<Text size="sm" fw={700}>
												{bmr} kcal
											</Text>
										</Group>

										<Group justify="space-between">
											<Group gap="xs">
												<Flame size={20} color="#FF8787" />
												<Text size="sm" fw={500}>
													Gasto Metabólico Total (TDEE)
												</Text>
											</Group>
											<Text fw={700} c="red" size="md">
												{tdee} kcal
											</Text>
										</Group>
									</Stack>
								</Stack>
							</Paper>

							<Paper withBorder={true} w="100%" p="lg" shadow="sm" style={{ borderRadius: '12px' }}>
								<Stack align="stretch" justify="flex-start" gap="md">
									<Title order={3} size={'h4'}>
										Métricas Avançadas
									</Title>

									<Group justify="space-around" wrap="wrap">
										{bodyFat !== null && (
											<Stack align="center" gap={4}>
												<RingProgress
													size={80}
													roundCaps
													thickness={8}
													sections={[{ value: bodyFat, color: 'red' }]}
													label={
														<Center>
															<Text size="xs" fw={700}>
																{bodyFat}%
															</Text>
														</Center>
													}
												/>
												<Text size="xs" fw={500} c="dimmed">
													Gordura Corporal
												</Text>
											</Stack>
										)}

										{muscleRate !== null && (
											<Stack align="center" gap={4}>
												<RingProgress
													size={80}
													roundCaps
													thickness={8}
													sections={[{ value: muscleRate, color: 'blue' }]}
													label={
														<Center>
															<Text size="xs" fw={700}>
																{muscleRate}%
															</Text>
														</Center>
													}
												/>
												<Text size="xs" fw={500} c="dimmed">
													Massa Muscular
												</Text>
											</Stack>
										)}

										{bodyFat === null && muscleRate === null && (
											<Text size="sm" c="dimmed" style={{ textAlign: 'center', width: '100%' }}>
												Nenhuma métrica avançada (% de gordura ou músculo) registrada.
											</Text>
										)}
									</Group>
								</Stack>
							</Paper>
						</>
					)}
				</Stack>
			</Paper>
		</MainLayout>
	)
}
