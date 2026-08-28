import { useState, useRef, useEffect } from 'react'
import {
	Container,
	Stack,
	Text,
	Card,
	Image,
	Badge,
	Group,
	TextInput,
	Center,
	Loader,
	Select,
	SimpleGrid,
} from '@mantine/core'
import { Search } from 'lucide-react'
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useDebouncedValue } from '@mantine/hooks'
import { MainLayout } from '../../../components/layout/MainLayout'
import { api } from '../../../api/axiosInstance'
import { type ExerciseDTO } from '@ate-a-falha/shared'

import { getExerciseImageUrl } from '../../../utils/exerciseImage'

export function ExerciseSearchPage() {
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
	const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null)
	const [debouncedSearch] = useDebouncedValue(searchQuery, 300)

	// Fetch ALL exercises once just to extract unique muscles and categories dynamically from the API/DB
	const { data: allCatalogExercises = [] } = useQuery<ExerciseDTO[]>({
		queryKey: ['exercise-catalog-all-options'],
		queryFn: async () => {
			const res = await api.get('/workout/exercise-catalog', {
				params: { take: 800 },
			})
			return res.data
		},
		staleTime: 1000 * 60 * 10, // Cache for 10 minutes - very efficient
	})

	// Dynamic extraction of muscles and categories, fully synchronized with the API
	const LOCALIZED_LABELS: Record<string, string> = {
		pescoco: 'Pescoço',
		antebraco: 'Antebraço',
		biceps: 'Bíceps',
		triceps: 'Tríceps',
		gluteos: 'Glúteos',
		trapezio: 'Trapézio',
		quadriceps: 'Quadríceps',
		forca: 'Força',
		alongamento: 'Alongamento',
	}

	const allMuscles = Array.from(new Set(allCatalogExercises.flatMap((e) => e.primaryMuscles)))
		.filter((m) => m && m !== 'admin-to-delete' && m !== 'chest')
		.map((m) => ({
			label: LOCALIZED_LABELS[m.toLowerCase()] || (m.charAt(0).toUpperCase() + m.slice(1)),
			value: m
		}))
		.sort((a, b) => a.label.localeCompare(b.label))

	const allCategories = Array.from(new Set(allCatalogExercises.map((e) => e.category)))
		.filter((c) => c && c !== 'admin-to-delete' && c !== 'streghnt')
		.map((c) => ({
			label: LOCALIZED_LABELS[c.toLowerCase()] || (c.charAt(0).toUpperCase() + c.slice(1)),
			value: c
		}))
		.sort((a, b) => a.label.localeCompare(b.label))

	// Infinite Query: Fetches 10 exercises per page from the backend database with active filters
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
	} = useInfiniteQuery<ExerciseDTO[]>({
		queryKey: ['exercise-catalog-infinite', debouncedSearch, selectedCategory, selectedMuscle],
		queryFn: async ({ pageParam }) => {
			const res = await api.get('/workout/exercise-catalog', {
				params: {
					name: debouncedSearch || undefined,
					category: selectedCategory || undefined,
					primaryMuscles: selectedMuscle || undefined,
					take: 10,
					cursorId: pageParam || undefined,
				},
			})
			return res.data
		},
		initialPageParam: undefined,
		getNextPageParam: (lastPage: ExerciseDTO[]) => {
			if (lastPage.length < 10) return undefined
			return lastPage[lastPage.length - 1].id
		},
	})

	// Flatten all pages of exercises into a single list
	const exercisesList = data?.pages.flatMap((page) => page) || []

	// Intersection Observer for Infinite Scroll trigger
	const observerTarget = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const target = observerTarget.current
		if (!target || !hasNextPage) return

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !isFetchingNextPage) {
					fetchNextPage()
				}
			},
			{ threshold: 0.1 }
		)

		observer.observe(target)
		return () => observer.unobserve(target)
	}, [hasNextPage, isFetchingNextPage, fetchNextPage])

	return (
		<MainLayout title="Exercícios" onBack={() => navigate(-1)}>
			<Container size="xs" px={0}>
				<Stack gap="md">
					{/* Search input */}
					<TextInput
						placeholder="Pesquisar..."
						value={searchQuery}
						onChange={(event) => setSearchQuery(event.currentTarget.value)}
						leftSection={<Search size={16} />}
						size="md"
						radius="md"
					/>

					{/* Dropdown Filters dynamically synchronized with the API */}
					<SimpleGrid cols={2} spacing="xs">
						<Select
							placeholder="Músculo Foco"
							data={allMuscles}
							value={selectedMuscle}
							onChange={(val) => setSelectedMuscle(val)}
							clearable
							radius="md"
						/>
						<Select
							placeholder="Categoria"
							data={allCategories}
							value={selectedCategory}
							onChange={(val) => setSelectedCategory(val)}
							clearable
							radius="md"
						/>
					</SimpleGrid>

					{/* Catalog Title */}
					<Group justify="space-between" align="center" px="xs">
						<Text fw={700} size="sm" c="dimmed">
							Catálogo de Exercícios
						</Text>
						<Text size="xs" c="dimmed">
							Exibindo {exercisesList.length} exercícios
						</Text>
					</Group>

					{/* Exercises list */}
					<Stack gap="sm">
						{isLoading && exercisesList.length === 0 ? (
							<Center p="xl">
								<Loader size="md" />
							</Center>
						) : exercisesList.length > 0 ? (
							<>
								{exercisesList.map((exercise) => {
									const imagePath = exercise.images?.[0]
									const exerciseImageUrl = getExerciseImageUrl(imagePath, true)

									return (
										<Card
											key={exercise.id}
											withBorder
											p="sm"
											radius="md"
											style={{ cursor: 'pointer' }}
											onClick={() => navigate(`/workout/exercises/${exercise.id}`)}
										>
											<Group gap="md" wrap="nowrap" align="center">
												<div style={{ width: '80px', height: '80px', flexShrink: 0, overflow: 'hidden', borderRadius: '8px' }}>
													<Image
														src={exerciseImageUrl}
														w={80}
														h={80}
														fit="cover"
														loading="lazy"
														fallbackSrc="https://placehold.co/80x80?text=Exercício"
														style={{ backgroundColor: 'var(--mantine-color-dark-8)' }}
													/>
												</div>

												<Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
													<Text fw={700} size="md" truncate>
														{exercise.name}
													</Text>
													
													<Group gap={6}>
														<Badge color="red.6" variant="light" size="xs">
															{exercise.primaryMuscles?.[0] || 'Músculo'}
														</Badge>
														<Badge color="blue" variant="filled" size="xs">
															{exercise.category}
														</Badge>
													</Group>
												</Stack>
											</Group>
										</Card>
									)
								})}

								{/* Infinite Scroll Trigger Indicator */}
								<div ref={observerTarget} style={{ height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
									{isFetchingNextPage && <Loader size="sm" />}
								</div>
							</>
						) : (
							<Center p="xl">
								<Text c="dimmed" size="sm">
									Nenhum exercício encontrado com estes critérios.
								</Text>
							</Center>
						)}
					</Stack>
				</Stack>
			</Container>
		</MainLayout>
	)
}
