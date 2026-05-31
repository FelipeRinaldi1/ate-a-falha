import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Container, Stack, Paper, Group, Text, Title, Center, Loader, ActionIcon } from '@mantine/core'
import { Trash2 } from 'lucide-react'
import { modals } from '@mantine/modals'
import { MainLayout } from '../../../components/layout/MainLayout'
import { api } from '../../../api/axiosInstance'
import { useAuth } from '../../user/hooks/useAuth'
import { type FoodDTO } from '@ate-a-falha/shared'

export function FoodDetailsPage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const { user } = useAuth()

	// Fetch food details from catalog
	const { data: food, isLoading } = useQuery<FoodDTO>({
		queryKey: ['food-catalog-detail', id],
		queryFn: async () => {
			const res = await api.get(`/nutrition/food-catalog/${id}`)
			return res.data
		},
		enabled: !!id,
	})

	// Mutation: Exclude food from catalog
	const deleteCatalogFoodMutation = useMutation({
		mutationFn: async () => {
			return api.delete(`/nutrition/food-catalog/${id}`)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['food-catalog'] })
			navigate(-1)
		},
	})

	const handleDeleteCatalogFood = () => {
		if (!food) return
		modals.openConfirmModal({
			title: 'Excluir Alimento',
			centered: true,
			children: (
				<Text size="sm">
					Tem certeza que deseja excluir o alimento <strong>{food.name}</strong> permanentemente do seu
					catálogo? Esta ação não pode ser desfeita.
				</Text>
			),
			labels: { confirm: 'Excluir', cancel: 'Cancelar' },
			confirmProps: { color: 'red' },
			onConfirm: () => deleteCatalogFoodMutation.mutate(),
		})
	}

	if (isLoading) {
		return (
			<MainLayout title="Alimento" onBack={() => navigate(-1)}>
				<Center style={{ height: '70vh' }}>
					<Loader size="lg" />
				</Center>
			</MainLayout>
		)
	}

	if (!food) {
		return (
			<MainLayout title="Alimento" onBack={() => navigate(-1)}>
				<Center style={{ height: '70vh' }}>
					<Text size="lg" c="dimmed">
						Alimento não encontrado no catálogo.
					</Text>
				</Center>
			</MainLayout>
		)
	}

	const isOwner = food.userId === user?.id

	return (
		<MainLayout
			title="Alimento"
			onBack={() => navigate(-1)}
			actions={
				isOwner ? (
					<ActionIcon
						variant="subtle"
						color="red"
						size="md"
						onClick={handleDeleteCatalogFood}
						loading={deleteCatalogFoodMutation.isPending}
					>
						<Trash2 size={20} />
					</ActionIcon>
				) : undefined
			}
		>
			<Container size="xs" px={0}>
				<Stack gap="md">
					{/* Main premium Card displaying food info like the mockup */}
					<Paper withBorder p="md" shadow="sm" radius="md">
						<Stack gap="md">
							{/* Top row: Label and Calories */}
							<Group justify="space-between" align="center">
								<Group gap={6}>
									<Text fw={700} size="sm" c="dimmed">
										Alimento
									</Text>
									{isOwner && (
										<Text
											span
											size="10px"
											fw={700}
											c="teal"
											bg="teal.9"
											px={6}
											py={2}
											style={{ borderRadius: '4px' }}
										>
											Meu Alimento
										</Text>
									)}
								</Group>
								<Text fw={700} size="lg" c="dimmed">
									{food.calories.toFixed(0)} Kal
								</Text>
							</Group>

							{/* Title: Food Name */}
							<Title order={2} size="h3" style={{ letterSpacing: '-0.5px' }}>
								{food.name}
							</Title>

							{/* Quantity Portion */}
							<Stack gap={2}>
								<Text size="xs" fw={700} c="dimmed">
									Quantidade (g)
								</Text>
								<Text fw={700} size="md">
									100g
								</Text>
							</Stack>

							{/* Macro list with premium consistent colors */}
							<Stack gap="xs" mt="xs">
								<Group
									justify="space-between"
									p="xs"
									style={{ borderBottom: '1px solid var(--mantine-color-dark-6)' }}
								>
									<Text fw={600} size="sm">
										Proteína
									</Text>
									<Text fw={700} size="sm" c="red.6">
										{food.protein.toFixed(1)}g
									</Text>
								</Group>
								<Group
									justify="space-between"
									p="xs"
									style={{ borderBottom: '1px solid var(--mantine-color-dark-6)' }}
								>
									<Text fw={600} size="sm">
										Carboidrato
									</Text>
									<Text fw={700} size="sm" c="yellow.5">
										{food.carbohydrate.toFixed(1)}g
									</Text>
								</Group>
								<Group
									justify="space-between"
									p="xs"
									style={{ borderBottom: '1px solid var(--mantine-color-dark-6)' }}
								>
									<Text fw={600} size="sm">
										Gordura
									</Text>
									<Text fw={700} size="sm" c="green.6">
										{food.lipids.toFixed(1)}g
									</Text>
								</Group>
								<Group justify="space-between" p="xs">
									<Text fw={600} size="sm">
										Fibra
									</Text>
									<Text fw={700} size="sm" c="teal.5">
										{food.fiber.toFixed(1)}g
									</Text>
								</Group>
							</Stack>
						</Stack>
					</Paper>
				</Stack>
			</Container>
		</MainLayout>
	)
}
