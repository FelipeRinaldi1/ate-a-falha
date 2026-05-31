import { useState } from 'react'
import {
	Container,
	Stack,
	Text,
	Group,
	Button,
	Center,
	Loader,
	Paper,
	ActionIcon,
	Modal,
	TextInput,
	Select,
	Badge,
} from '@mantine/core'
import { ChevronRight, Plus, Trash2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { modals } from '@mantine/modals'
import { MainLayout } from '../../../components/layout/MainLayout'
import { api } from '../../../api/axiosInstance'
import { type PlanDTO } from '@ate-a-falha/shared'

const GOAL_LABELS: Record<string, string> = {
	forca: 'Força',
	hipertrofia: 'Hipertrofia',
	resistencia: 'Resistência Muscular',
}

export function WorkoutPlansPage() {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const [createModalOpen, setCreateModalOpen] = useState(false)
	const [newPlanName, setNewPlanName] = useState('')
	const [newPlanGoal, setNewPlanGoal] = useState<'forca' | 'hipertrofia' | 'resistencia'>('hipertrofia')

	// Fetch all workout plans
	const { data: plans = [], isLoading } = useQuery<PlanDTO[]>({
		queryKey: ['workout-plans'],
		queryFn: async () => {
			const res = await api.get('/workout/plans')
			return res.data
		},
	})

	// Mutation: Create a new plan
	const createPlanMutation = useMutation({
		mutationFn: async (data: { name: string; goal: string }) => {
			const res = await api.post('/workout/plans', data)
			return res.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['workout-plans'] })
			setCreateModalOpen(false)
			setNewPlanName('')
			setNewPlanGoal('hipertrofia')
		},
	})

	// Mutation: Toggle active plan
	const togglePlanActiveMutation = useMutation({
		mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
			return api.patch(`/workout/plans/${id}`, { isActive })
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['workout-plans'] })
		},
	})

	// Mutation: Delete plan
	const deletePlanMutation = useMutation({
		mutationFn: async (id: string) => {
			return api.delete(`/workout/plans/${id}`)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['workout-plans'] })
		},
	})

	const handleCreatePlan = () => {
		if (newPlanName.trim().length < 3) return
		createPlanMutation.mutate({
			name: newPlanName,
			goal: newPlanGoal,
		})
	}

	const handleDeletePlan = (event: React.MouseEvent, plan: PlanDTO) => {
		event.stopPropagation()
		modals.openConfirmModal({
			title: 'Excluir Ficha de Treino',
			centered: true,
			children: (
				<Text size="sm">
					Tem certeza que deseja excluir a ficha <strong>{plan.name}</strong> permanentemente? Esta ação excluirá todos os treinos vinculados a ela.
				</Text>
			),
			labels: { confirm: 'Excluir', cancel: 'Cancelar' },
			confirmProps: { color: 'red' },
			onConfirm: () => deletePlanMutation.mutate(plan.id),
		})
	}

	if (isLoading) {
		return (
			<MainLayout title="Minhas Fichas" onBack={() => navigate(-1)}>
				<Center style={{ height: '70vh' }}>
					<Loader size="lg" />
				</Center>
			</MainLayout>
		)
	}

	return (
		<MainLayout title="Minhas Fichas" onBack={() => navigate(-1)}>
			<Container size="xs" px={0}>
				<Stack gap="md" pb={80}>
					{/* Plan list matching the mockup */}
					<Stack gap="sm">
						{plans.length > 0 ? (
							plans.map((plan) => (
								<Paper
									key={plan.id}
									withBorder
									p="md"
									radius="md"
									shadow="sm"
									style={{
										cursor: 'pointer',
										position: 'relative',
										border: plan.isActive ? '1.5px solid var(--mantine-color-blue-filled)' : undefined,
									}}
									onClick={() => navigate(`/workout/plans/${plan.id}/edit`)}
								>
									<Group justify="space-between" align="center" wrap="nowrap">
										<Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
											<Group gap="xs" wrap="nowrap">
												<Text fw={700} size="md" truncate>
													{plan.name}
												</Text>
												{plan.isActive && (
													<Badge color="blue" variant="filled" size="xs">
														Ativa
													</Badge>
												)}
											</Group>
											<Text size="xs" c="dimmed" fw={600}>
												{GOAL_LABELS[(plan as any).goal] || 'Hipertrofia'}
											</Text>
										</Stack>

										<Group gap="xs">
											<Button
												size="xs"
												variant="light"
												color={plan.isActive ? 'red' : 'blue'}
												onClick={(e) => {
													e.stopPropagation()
													togglePlanActiveMutation.mutate({ id: plan.id, isActive: !plan.isActive })
												}}
												loading={togglePlanActiveMutation.isPending}
											>
												{plan.isActive ? 'Desativar' : 'Ativar'}
											</Button>
											<ActionIcon
												variant="subtle"
												color="red"
												size="md"
												onClick={(e) => handleDeletePlan(e, plan)}
											>
												<Trash2 size={16} />
											</ActionIcon>
											<ActionIcon variant="subtle" color="gray" size="md">
												<ChevronRight size={18} />
											</ActionIcon>
										</Group>
									</Group>
								</Paper>
							))
						) : (
							<Center p="xl">
								<Text c="dimmed" size="sm">
									Nenhuma ficha de treino cadastrada.
								</Text>
							</Center>
						)}
					</Stack>

					{/* Bottom Nova Ficha Button */}
					<Button
						leftSection={<Plus size={20} />}
						size="lg"
						radius="xl"
						color="blue"
						fullWidth
						mt="md"
						onClick={() => setCreateModalOpen(true)}
						style={{
							boxShadow: '0 8px 24px rgba(34, 139, 230, 0.3)',
							fontWeight: 800,
						}}
					>
						Nova Ficha
					</Button>
				</Stack>
			</Container>

			{/* Create Plan Modal */}
			<Modal
				opened={createModalOpen}
				onClose={() => setCreateModalOpen(false)}
				title="Criar Nova Ficha de Treino"
				centered
				radius="md"
			>
				<Stack gap="md">
					<TextInput
						label="Nome da Ficha"
						placeholder="Ex: Treino ABCDEF"
						value={newPlanName}
						onChange={(e) => setNewPlanName(e.currentTarget.value)}
						required
					/>
					<Select
						label="Foco do Treino"
						placeholder="Selecione o objetivo..."
						value={newPlanGoal}
						onChange={(val) => setNewPlanGoal(val as any)}
						data={[
							{ label: 'Força', value: 'forca' },
							{ label: 'Hipertrofia', value: 'hipertrofia' },
							{ label: 'Resistência Muscular', value: 'resistencia' },
						]}
						required
					/>
					<Button
						color="blue"
						fullWidth
						onClick={handleCreatePlan}
						disabled={newPlanName.trim().length < 3}
						loading={createPlanMutation.isPending}
					>
						Criar Ficha
					</Button>
				</Stack>
			</Modal>
		</MainLayout>
	)
}
