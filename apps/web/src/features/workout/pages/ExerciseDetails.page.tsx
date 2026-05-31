import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Container, Stack, Paper, Group, Text, Title, Center, Loader, Image, Badge, List } from '@mantine/core'
import { MainLayout } from '../../../components/layout/MainLayout'
import { api } from '../../../api/axiosInstance'
import { type ExerciseDTO } from '@ate-a-falha/shared'

export function ExerciseDetailsPage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()

	// Fetch exercise details from catalog
	const { data: exercise, isLoading } = useQuery<ExerciseDTO>({
		queryKey: ['exercise-catalog-detail', id],
		queryFn: async () => {
			const res = await api.get(`/workout/exercise-catalog/${id}`)
			return res.data
		},
		enabled: !!id,
	})

	const [currentImageIndex, setCurrentImageIndex] = useState(0)

	// Image slideshow with 2.3 seconds interval
	useEffect(() => {
		if (!exercise?.images || exercise.images.length <= 1) return

		const interval = setInterval(() => {
			setCurrentImageIndex((prev) => (prev + 1) % exercise.images.length)
		}, 2300)

		return () => clearInterval(interval)
	}, [exercise?.images])

	const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1'

	if (isLoading) {
		return (
			<MainLayout title="Exercício" onBack={() => navigate(-1)}>
				<Center style={{ height: '70vh' }}>
					<Loader size="lg" />
				</Center>
			</MainLayout>
		)
	}

	if (!exercise) {
		return (
			<MainLayout title="Exercício" onBack={() => navigate(-1)}>
				<Center style={{ height: '70vh' }}>
					<Text size="lg" c="dimmed">
						Exercício não encontrado no catálogo.
					</Text>
				</Center>
			</MainLayout>
		)
	}

	const imagesList = exercise.images && exercise.images.length > 0
		? exercise.images
		: ['placeholder']

	return (
		<MainLayout title="Exercício" onBack={() => navigate(-1)}>
			<Container size="xs" px={0}>
				<Stack gap="md">
					{/* Image Section wrapped in Paper */}
					<Paper withBorder p="md" shadow="sm" radius="md">
						<Stack gap="xs" align="center">
							<Text fw={700} size="sm" c="dimmed" style={{ letterSpacing: '0.5px', textTransform: 'uppercase' }}>
								Imagens do Exercício
							</Text>
							
							<Center style={{
								width: '100%',
								height: 240,
								position: 'relative',
								overflow: 'hidden',
								borderRadius: '8px',
								backgroundColor: 'var(--mantine-color-dark-8)'
							}}>
								{imagesList.map((img, index) => {
									const isPlaceholder = img === 'placeholder'
									const exerciseImageUrl = isPlaceholder
										? 'https://placehold.co/600x400?text=Imagens+do+Exerc%C3%ADcio'
										: `${apiBaseUrl}/assets/exercises/${img.endsWith('.webp') ? img : img.replace(/\.[^/.]+$/, '.webp')}`

									return (
										<Image
											key={img}
											src={exerciseImageUrl}
											alt={`${exercise.name} ${index}`}
											fit="contain"
											height={240}
											fallbackSrc="https://placehold.co/600x400?text=Imagens+do+Exerc%C3%ADcio"
											style={{
												position: 'absolute',
												top: 0,
												left: 0,
												width: '100%',
												height: '100%',
												opacity: currentImageIndex === index ? 1 : 0,
												transition: 'opacity 0.5s ease-in-out',
												zIndex: currentImageIndex === index ? 1 : 0,
											}}
										/>
									)
								})}
							</Center>
						</Stack>
					</Paper>

					{/* Exercise Title */}
					<Center>
						<Title order={1} size="h2" style={{ textAlign: 'center', letterSpacing: '-0.5px' }}>
							{exercise.name}
						</Title>
					</Center>

					{/* Foco & Descrição Section wrapped in Paper */}
					<Paper withBorder p="md" shadow="sm" radius="md">
						<Stack gap="md">
							{/* Foco & Categoria / Tipo */}
							<Group justify="space-between" align="flex-start" wrap="wrap">
								{/* Foco / Muscles */}
								<Stack gap="xs" style={{ flex: 1, minWidth: 150 }}>
									<Text fw={700} size="sm" c="dimmed">
										Foco:
									</Text>
									<Group gap={6}>
										{exercise.primaryMuscles.map((muscle) => (
											<Badge key={muscle} color="red.6" variant="light" size="md">
												{muscle}
											</Badge>
										))}
										{exercise.secondaryMuscles.map((muscle) => (
											<Badge key={muscle} color="gray" variant="outline" size="sm">
												{muscle}
											</Badge>
										))}
									</Group>
								</Stack>

								{/* Categoria */}
								<Stack gap="xs" align="flex-end" style={{ textAlign: 'right' }}>
									<Text fw={700} size="sm" c="dimmed">
										Tipo:
									</Text>
									<Badge color="gray" variant="outline" size="md">
										{exercise.category}
									</Badge>
								</Stack>
							</Group>

							{/* Descrição / Instructions */}
							<Stack gap="xs">
								<Text fw={700} size="sm" c="dimmed">
									Descrição:
								</Text>
								{exercise.instructions && exercise.instructions.length > 0 ? (
									<List type="ordered" spacing="xs" size="sm" style={{ paddingLeft: '12px' }}>
										{exercise.instructions.map((step, idx) => (
											<List.Item key={idx}>
												<Text size="sm" style={{ lineHeight: 1.5 }}>
													{step}
												</Text>
											</List.Item>
										))}
									</List>
								) : (
									<Text size="sm" c="dimmed">
										Nenhuma instrução disponível para este exercício.
									</Text>
								)}
							</Stack>
						</Stack>
					</Paper>
				</Stack>
			</Container>
		</MainLayout>
	)
}
