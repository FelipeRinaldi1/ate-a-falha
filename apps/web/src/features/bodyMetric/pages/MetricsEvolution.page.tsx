import { useState } from 'react'
import { api } from '../../../api/axiosInstance'
import { Center, Container, Title, Button, Stack, Group, SegmentedControl, Paper, Loader, Text } from '@mantine/core'
import { ArrowLeft, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LineChart } from '@mantine/charts'
import { BodyMetricLogic } from '@ate-a-falha/shared'
import { useAuth } from '../../user/hooks/useAuth'
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
	const [selectedTab, setSelectedTab] = useState('weight')

	const { data: metrics = [], isLoading } = useQuery<BodyMetric[]>({
		queryKey: ['body-metrics', { take: 100 }],
		queryFn: async () => {
			const response = await api.get('/users/body-metrics?take=100')
			return response.data
		},
		enabled: !!user,
	})

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

	const chartData = [...metrics].reverse().map((m) => {
		const bmiValue = BodyMetricLogic.calculateBMI(m.weight, m.height / 100)
		return {
			date: dayjs(m.createdAt).format('DD/MM'),
			weight: m.weight,
			bmi: bmiValue,
			bodyFat: m.bodyFat ?? 0,
			muscleRate: m.muscleRate ?? 0,
		}
	})

	const getChartSeries = () => {
		switch (selectedTab) {
			case 'weight':
				return [{ name: 'weight', label: 'Peso (kg)', color: 'teal.6' }]
			case 'bmi':
				return [{ name: 'bmi', label: 'IMC', color: 'orange.6' }]
			case 'percentages':
				return [
					{ name: 'bodyFat', label: 'Gordura (%)', color: 'red.6' },
					{ name: 'muscleRate', label: 'Músculo (%)', color: 'blue.6' },
				]
			default:
				return []
		}
	}

	return (
		<Center style={{ minHeight: '80vh', padding: '24px 0' }}>
			<Container size="md" w="100%">
				<Stack gap="lg">
					<Group>
						<Button
							variant="subtle"
							leftSection={<ArrowLeft size={16} />}
							onClick={() => navigate('/profile')}
							size="xs"
							color="gray"
						>
							Voltar ao Perfil
						</Button>
					</Group>

					<Stack gap={4} style={{ textAlign: 'center' }}>
						<Title order={2} style={{ letterSpacing: '-0.5px' }}>
							Gráficos de Evolução Corporal
						</Title>
						<Text size="sm" c="dimmed">
							Acompanhe o progresso das suas métricas ao longo do tempo.
						</Text>
					</Stack>

					<Center>
						<SegmentedControl
							value={selectedTab}
							onChange={setSelectedTab}
							data={[
								{ label: 'Peso (kg)', value: 'weight' },
								{ label: 'IMC', value: 'bmi' },
								{ label: 'Percentuais (%)', value: 'percentages' },
							]}
							radius="md"
							size="sm"
							w={{ base: '100%', sm: 'auto' }}
						/>
					</Center>

					<Paper withBorder p="xl" radius="md" shadow="sm">
						<Stack gap="md">
							<LineChart
								h={320}
								data={chartData}
								dataKey="date"
								series={getChartSeries()}
								curveType="monotone"
								connectNulls={true}
								gridAxis="xy"
							/>
						</Stack>
					</Paper>
				</Stack>
			</Container>
		</Center>
	)
}
