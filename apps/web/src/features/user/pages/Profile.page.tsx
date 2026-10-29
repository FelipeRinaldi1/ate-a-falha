import { useState } from 'react'
import {
	Center,
	Container,
	Paper,
	Stack,
	Group,
	Text,
	Title,
	Avatar,
	Button,
	Loader,
	RingProgress,
	Modal,
	TextInput,
	PasswordInput,
	Select,
	Tabs,
	Alert,
} from '@mantine/core'
import { MainLayout } from '../../../components/layout/MainLayout'
import { Flame, Ruler, Scale, Weight, Edit, Plus, Info, TrendingUp, LogOut, UserCheck, Lock } from 'lucide-react'
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
	const { user, logout, refreshUser } = useAuth()
	const navigate = useNavigate()

	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [editName, setEditName] = useState('')
	const [editGender, setEditGender] = useState<string>('MALE')
	const [editBirthDate, setEditBirthDate] = useState('')
	const [oldPassword, setOldPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [modalMessage, setModalMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
	const [isSavingProfile, setIsSavingProfile] = useState(false)
	const [isSavingPassword, setIsSavingPassword] = useState(false)

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
			<MainLayout title="Perfil">
				<Center style={{ height: '50vh' }}>
					<Loader size="xl" />
				</Center>
			</MainLayout>
		)
	}

	const openEditProfileModal = () => {
		setEditName(user.name)
		setEditGender(user.gender || 'MALE')
		const formattedBirth = user.birthDate
			? new Date(user.birthDate).toISOString().split('T')[0]
			: ''
		setEditBirthDate(formattedBirth)
		setOldPassword('')
		setNewPassword('')
		setModalMessage(null)
		setIsEditModalOpen(true)
	}

	const handleSaveProfile = async () => {
		if (!editName.trim()) {
			setModalMessage({ type: 'error', text: 'O nome é obrigatório.' })
			return
		}
		setIsSavingProfile(true)
		setModalMessage(null)
		try {
			await api.put('/users/me', {
				name: editName.trim(),
				gender: editGender,
				...(editBirthDate ? { birthDate: new Date(editBirthDate).toISOString() } : {}),
			})
			await refreshUser()
			setModalMessage({ type: 'success', text: 'Dados da conta atualizados com sucesso!' })
		} catch (err: unknown) {
			const errorResponse = err as { response?: { data?: { message?: string } } }
			setModalMessage({
				type: 'error',
				text: errorResponse?.response?.data?.message || 'Não foi possível atualizar os dados da conta.',
			})
		} finally {
			setIsSavingProfile(false)
		}
	}

	const handleChangePassword = async () => {
		if (!oldPassword || !newPassword) {
			setModalMessage({ type: 'error', text: 'Preencha a senha atual e a nova senha.' })
			return
		}
		setIsSavingPassword(true)
		setModalMessage(null)
		try {
			await api.patch('/users/me/password', {
				oldPassword,
				newPassword,
			})
			setOldPassword('')
			setNewPassword('')
			setModalMessage({ type: 'success', text: 'Senha alterada com sucesso!' })
		} catch (err: unknown) {
			const errorResponse = err as {
				response?: { data?: { message?: string; details?: Array<{ message?: string }> } }
			}
			setModalMessage({
				type: 'error',
				text:
					errorResponse?.response?.data?.details?.[0]?.message ||
					errorResponse?.response?.data?.message ||
					'Verifique a senha atual e tente novamente (mín. 8 caracteres, maiúscula, minúscula, número e símbolo).',
			})
		} finally {
			setIsSavingPassword(false)
		}
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
		<MainLayout title="Perfil">
			<Container size="xs" px={0}>
				<Stack gap="md">
					{/* User identity card */}
					<Paper withBorder p="md" radius="md" shadow="sm">
						<Stack align="center" gap="sm">
							<Avatar
								size={96}
								alt={user.name}
								color="blue"
								radius="xl"
								style={{ fontSize: '36px', fontWeight: 'bold' }}
							>
								{user.name.substring(0, 2).toUpperCase()}
							</Avatar>
							<Stack align="center" gap={2}>
								<Title order={2} size="h3" style={{ letterSpacing: '-0.5px' }}>
									{user.name}
								</Title>
								<Text size="sm" c="dimmed">
									{user.email}
								</Text>
							</Stack>
							<Button
								variant="subtle"
								size="xs"
								radius="md"
								leftSection={<Edit size={14} />}
								onClick={openEditProfileModal}
							>
								Editar Conta
							</Button>
						</Stack>
					</Paper>

					{!latestMetric ? (
						<Paper withBorder p="xl" radius="md" shadow="sm" style={{ textAlign: 'center' }}>
							<Stack align="center" gap="md">
								<Info size={40} color="#4A5568" />
								<Title order={3} size="h4">
									Nenhuma métrica cadastrada
								</Title>
								<Text size="sm" c="dimmed" style={{ maxWidth: '320px' }}>
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
							{/* Action buttons */}
							<Group gap="sm" grow>
								<Button
									variant="default"
									leftSection={<TrendingUp size={16} />}
									onClick={() => navigate('/profile/evolution')}
									radius="md"
								>
									Evolução
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

							{/* Body metrics card */}
							<Paper withBorder p="md" radius="md" shadow="sm">
								<Stack gap="md">
									<Group justify="space-between" align="center">
										<Title order={3} size="h5" fw={700}>
											Métricas Corporais
										</Title>
										<Button
											variant="subtle"
											leftSection={<Edit size={14} />}
											size="xs"
											radius="md"
											onClick={() => navigate('/profile/edit-metrics')}
										>
											Editar
										</Button>
									</Group>

									<Group grow gap="sm">
										<Paper withBorder p="sm" radius="md" style={{ textAlign: 'center' }}>
											<Stack align="center" gap={4}>
												<Ruler size={20} color="#228BE6" />
												<Text size="xs" c="dimmed">
													Altura
												</Text>
												<Text size="md" fw={700}>
													{latestMetric.height} cm
												</Text>
											</Stack>
										</Paper>

										<Paper withBorder p="sm" radius="md" style={{ textAlign: 'center' }}>
											<Stack align="center" gap={4}>
												<Weight size={20} color="#12B886" />
												<Text size="xs" c="dimmed">
													Peso
												</Text>
												<Text size="md" fw={700}>
													{latestMetric.weight} kg
												</Text>
											</Stack>
										</Paper>

										<Paper withBorder p="sm" radius="md" style={{ textAlign: 'center' }}>
											<Stack align="center" gap={4}>
												<Scale size={20} color="#FD7E14" />
												<Text size="xs" c="dimmed">
													IMC
												</Text>
												<Text size="md" fw={700} c={bmiInfo.color}>
													{bmi}
												</Text>
											</Stack>
										</Paper>
									</Group>

									<Group justify="center">
										<Text size="xs" fw={500} c="dimmed">
											Classificação:{' '}
											<Text component="span" fw={700} c={bmiInfo.color}>
												{bmiInfo.label}
											</Text>
										</Text>
									</Group>
								</Stack>
							</Paper>

							{/* Caloric expenditure card */}
							<Paper withBorder p="md" radius="md" shadow="sm">
								<Stack gap="md">
									<Title order={3} size="h5" fw={700}>
										Gasto Calórico
									</Title>

									<Stack gap="xs">
										<Group
											justify="space-between"
											p="xs"
											style={{ borderBottom: '1px solid var(--mantine-color-dark-6)' }}
										>
											<Group gap="xs">
												<Flame size={16} color="#E03131" />
												<Text size="sm" fw={500}>
													Nível de atividade
												</Text>
											</Group>
											<Text size="sm" fw={600}>
												{activityLevelLabels[latestMetric.activityLevel] ?? 'Desconhecido'}
											</Text>
										</Group>

										<Group
											justify="space-between"
											p="xs"
											style={{ borderBottom: '1px solid var(--mantine-color-dark-6)' }}
										>
											<Group gap="xs">
												<Flame size={16} color="#FA5252" />
												<Text size="sm" fw={500}>
													BMR
												</Text>
											</Group>
											<Text size="sm" fw={700}>
												{bmr} kcal
											</Text>
										</Group>

										<Group justify="space-between" p="xs">
											<Group gap="xs">
												<Flame size={16} color="#FF8787" />
												<Text size="sm" fw={500}>
													TDEE
												</Text>
											</Group>
											<Text size="sm" fw={700} c="red.6">
												{tdee} kcal
											</Text>
										</Group>
									</Stack>
								</Stack>
							</Paper>

							{/* Advanced metrics card */}
							{(bodyFat !== null || muscleRate !== null) && (
								<Paper withBorder p="md" radius="md" shadow="sm">
									<Stack gap="md">
										<Title order={3} size="h5" fw={700}>
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
										</Group>
									</Stack>
								</Paper>
							)}
						</>
					)}

					{/* Botão Sair da Conta */}
					<Button
						variant="light"
						color="red"
						fullWidth
						radius="md"
						size="md"
						leftSection={<LogOut size={18} />}
						onClick={logout}
						mt="sm"
					>
						Sair da Conta
					</Button>
				</Stack>
			</Container>

			{/* Modal de Edição de Conta e Senha */}
			<Modal
				opened={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				title={<Text fw={700}>Configurações da Conta</Text>}
				centered
			>
				<Stack gap="md">
					{modalMessage && (
						<Alert color={modalMessage.type === 'success' ? 'green' : 'red'} radius="md">
							{modalMessage.text}
						</Alert>
					)}

					<Tabs defaultValue="profile">
						<Tabs.List grow mb="md">
							<Tabs.Tab value="profile" leftSection={<UserCheck size={14} />}>
								Meus Dados
							</Tabs.Tab>
							<Tabs.Tab value="password" leftSection={<Lock size={14} />}>
								Alterar Senha
							</Tabs.Tab>
						</Tabs.List>

						<Tabs.Panel value="profile">
							<Stack gap="sm">
								<TextInput
									label="Nome"
									value={editName}
									onChange={(e) => setEditName(e.currentTarget.value)}
									required
								/>
								<TextInput
									label="Data de Nascimento"
									type="date"
									value={editBirthDate}
									onChange={(e) => setEditBirthDate(e.currentTarget.value)}
								/>
								<Select
									label="Gênero"
									value={editGender}
									onChange={(val) => setEditGender(val || 'MALE')}
									data={[
										{ value: 'MALE', label: 'Masculino' },
										{ value: 'FEMALE', label: 'Feminino' },
										{ value: 'OTHER', label: 'Outro' },
									]}
								/>
								<Button
									fullWidth
									mt="xs"
									loading={isSavingProfile}
									onClick={handleSaveProfile}
								>
									Salvar Alterações
								</Button>
							</Stack>
						</Tabs.Panel>

						<Tabs.Panel value="password">
							<Stack gap="sm">
								<PasswordInput
									label="Senha Atual"
									value={oldPassword}
									onChange={(e) => setOldPassword(e.currentTarget.value)}
									required
								/>
								<PasswordInput
									label="Nova Senha"
									description="Mín. 8 caracteres, letra maiúscula, minúscula, número e símbolo"
									value={newPassword}
									onChange={(e) => setNewPassword(e.currentTarget.value)}
									required
								/>
								<Button
									fullWidth
									mt="xs"
									color="blue"
									loading={isSavingPassword}
									onClick={handleChangePassword}
								>
									Atualizar Senha
								</Button>
							</Stack>
						</Tabs.Panel>
					</Tabs>
				</Stack>
			</Modal>
		</MainLayout>
	)
}
