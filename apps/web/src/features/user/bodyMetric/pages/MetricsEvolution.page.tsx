import { useState, useMemo } from 'react'
import { api } from '../../../../api/axiosInstance'
import {
	Center,
	Container,
	Title,
	Button,
	Stack,
	Group,
	SegmentedControl,
	Paper,
	Loader,
	Text,
	SimpleGrid,
	Card,
	Badge,
} from '@mantine/core'
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Scale, Flame, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AreaChart } from '@mantine/charts'
import { BodyMetricLogic } from '@ate-a-falha/shared'
import { useAuth } from '../../hooks/useAuth'
import dayjs from 'dayjs'
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

export function MetricsEvolutionPage() {
	const navigate = useNavigate()
	const { user } = useAuth()
	const [selectedTab, setSelectedTab] = useState<'weight' | 'bmi' | 'percentages'>('weight')

	const { data: metrics = [], isLoading } = useQuery<BodyMetric[]>({
		queryKey: ['body-metrics', { take: 100 }],
		queryFn: async () => {
			const response = await api.get('/users/body-metrics?take=100')
			return response.data
		},
		enabled: !!user,
	})

	const chronologicalMetrics = useMemo(() => [...metrics].reverse(), [metrics])

	if (isLoading || !user) {
		return (
			<Center style={{ height: '50vh' }}>
				<Loader size="xl" />
			</Center>
		)
	}

	if (!metrics || metrics.length === 0) {
		return (
			<Center style={{ minHeight: '80vh' }}>
				<Container size="xs">
					<Stack align="center" gap="md" style={{ textAlign: 'center' }}>
						<TrendingUp size={48} color="#A8AEC1" />
						<Title order={2}>Sem histórico para exibir</Title>
						<Text size="sm" c="dimmed">
							Você precisa cadastrar pelo menos uma métrica corporal para ver o gráfico de evolução.
						</Text>
						<Button onClick={() => navigate('/profile')} variant="light">
							Voltar ao Perfil
						</Button>
					</Stack>
				</Container>
			</Center>
		)
	}

	// Calculate summary stats
	const initialMetric = chronologicalMetrics[0]
	const latestMetric = chronologicalMetrics[chronologicalMetrics.length - 1]

	const weightDelta = latestMetric.weight - initialMetric.weight
	const latestBMI = BodyMetricLogic.calculateBMI(latestMetric.weight, latestMetric.height / 100)
	const initialBMI = BodyMetricLogic.calculateBMI(initialMetric.weight, initialMetric.height / 100)
	const bmiDelta = latestBMI - initialBMI

	const chartData = chronologicalMetrics.map((m) => {
		const bmiValue = BodyMetricLogic.calculateBMI(m.weight, m.height / 100)
		return {
			date: dayjs(m.createdAt).format('DD/MM'),
			fullDate: dayjs(m.createdAt).format('DD/MM/YYYY'),
			weight: m.weight,
			bmi: bmiValue,
			bodyFat: m.bodyFat ?? 0,
			muscleRate: m.muscleRate ?? 0,
		}
	})

	const getChartSeries = () => {
		switch (selectedTab) {
			case 'weight':
				return [{ name: 'weight', label: 'Peso (kg)', color: 'brand.5' }]
			case 'bmi':
				return [{ name: 'bmi', label: 'IMC', color: 'orange.6' }]
			case 'percentages':
				return [
					{ name: 'bodyFat', label: 'Gordura (%)', color: 'red.6' },
					{ name: 'muscleRate', label: 'Massa Muscular (%)', color: 'blue.6' },
				]
			default:
				return []
		}
	}

	const renderDeltaBadge = (delta: number, unit: string) => {
		const absDelta = Math.abs(delta).toFixed(1)
		if (delta > 0) {
			return (
				<Badge color="orange" variant="light" size="sm" leftSection={<TrendingUp size={12} />}>
					+{absDelta} {unit}
				</Badge>
			)
		}
		if (delta < 0) {
			return (
				<Badge color="teal" variant="light" size="sm" leftSection={<TrendingDown size={12} />}>
					-{absDelta} {unit}
				</Badge>
			)
		}
		return (
			<Badge color="gray" variant="light" size="sm" leftSection={<Minus size={12} />}>
				Estável
			</Badge>
		)
	}

	return (
		<Center style={{ minHeight: '80vh', padding: '24px 0' }}>
			<Container size="md" w="100%">
				<Stack gap="lg">
					<Group justify="space-between" align="center">
						<Button
							variant="subtle"
							leftSection={<ArrowLeft size={16} />}
							onClick={() => navigate('/profile')}
							size="xs"
							color="gray"
						>
							Voltar ao Perfil
						</Button>
						<Button
							variant="light"
							size="xs"
							onClick={() => navigate('/profile/metrics/new')}
						>
							Registrar Métrica
						</Button>
					</Group>

					<Stack gap={4} style={{ textAlign: 'center' }}>
						<Title order={2} style={{ letterSpacing: '-0.5px' }}>
							Evolução Corporal
						</Title>
						<Text size="sm" c="dimmed">
							Histórico e métricas registradas ao longo do tempo.
						</Text>
					</Stack>

					{/* Top KPI Cards */}
					<SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
						<Card withBorder p="md" radius="md" shadow="xs">
							<Group justify="space-between" align="flex-start">
								<Stack gap={2}>
									<Text size="xs" fw={700} c="dimmed" style={{ textTransform: 'uppercase' }}>
										Peso Atual
									</Text>
									<Text size="xl" fw={800}>
										{latestMetric.weight} <Text span size="sm" fw={500} c="dimmed">kg</Text>
									</Text>
								</Stack>
								<Paper p="xs" radius="md" bg="var(--mantine-color-dark-6)">
									<Scale size={20} color="var(--mantine-primary-color-filled)" />
								</Paper>
							</Group>
							<Group mt="xs" justify="space-between">
								<Text size="xs" c="dimmed">
									Inicial: {initialMetric.weight} kg
								</Text>
								{renderDeltaBadge(weightDelta, 'kg')}
							</Group>
						</Card>

						<Card withBorder p="md" radius="md" shadow="xs">
							<Group justify="space-between" align="flex-start">
								<Stack gap={2}>
									<Text size="xs" fw={700} c="dimmed" style={{ textTransform: 'uppercase' }}>
										IMC Atual
									</Text>
									<Text size="xl" fw={800}>
										{latestBMI}
									</Text>
								</Stack>
								<Paper p="xs" radius="md" bg="var(--mantine-color-dark-6)">
									<Activity size={20} color="#FD7E14" />
								</Paper>
							</Group>
							<Group mt="xs" justify="space-between">
								<Text size="xs" c="dimmed">
									Inicial: {initialBMI}
								</Text>
								{renderDeltaBadge(bmiDelta, '')}
							</Group>
						</Card>

						<Card withBorder p="md" radius="md" shadow="xs">
							<Group justify="space-between" align="flex-start">
								<Stack gap={2}>
									<Text size="xs" fw={700} c="dimmed" style={{ textTransform: 'uppercase' }}>
										Composição
									</Text>
									<Text size="xl" fw={800}>
										{latestMetric.bodyFat ? `${latestMetric.bodyFat}%` : '--'} <Text span size="xs" c="dimmed">Gord</Text>
									</Text>
								</Stack>
								<Paper p="xs" radius="md" bg="var(--mantine-color-dark-6)">
									<Flame size={20} color="#FA5252" />
								</Paper>
							</Group>
							<Group mt="xs" justify="space-between">
								<Text size="xs" c="dimmed">
									Músculo: {latestMetric.muscleRate ? `${latestMetric.muscleRate}%` : '--'}
								</Text>
								<Text size="xs" c="dimmed">
									{chronologicalMetrics.length} pesagens
								</Text>
							</Group>
						</Card>
					</SimpleGrid>

					{/* Navigation Segmented Control */}
					<Center>
						<SegmentedControl
							value={selectedTab}
							onChange={(val) => setSelectedTab(val as typeof selectedTab)}
							data={[
								{ label: 'Peso Corporal (kg)', value: 'weight' },
								{ label: 'Índice IMC', value: 'bmi' },
								{ label: 'Gordura & Músculo (%)', value: 'percentages' },
							]}
							radius="md"
							size="sm"
							w={{ base: '100%', sm: 'auto' }}
						/>
					</Center>

					{/* Main Chart Card */}
					<Paper withBorder p="lg" radius="md" shadow="sm">
						<Stack gap="md">
							<Group justify="space-between" align="center">
								<Text fw={700} size="sm">
									{selectedTab === 'weight'
										? 'Progressão de Peso (kg)'
										: selectedTab === 'bmi'
										? 'Progressão de IMC'
										: 'Percentuais de Gordura e Massa Muscular (%)'}
								</Text>
								<Text size="xs" c="dimmed">
									Últimos {chartData.length} registros
								</Text>
							</Group>

							<AreaChart
								h={320}
								data={chartData}
								dataKey="date"
								series={getChartSeries()}
								curveType="monotone"
								connectNulls={true}
								gridAxis="xy"
								withDots={chartData.length <= 25}
								strokeWidth={2.5}
								fillOpacity={0.15}
							/>
						</Stack>
					</Paper>
				</Stack>
			</Container>
		</Center>
	)
}

