import { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react'
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
import { useQuery, useInfiniteQuery, keepPreviousData } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useDebouncedValue } from '@mantine/hooks'
import { MainLayout } from '../../../components/layout/MainLayout'
import { api } from '../../../api/axiosInstance'
import { type ExerciseDTO } from '@ate-a-falha/shared'

import { getExerciseImageUrl } from '../../../utils/exerciseImage'
import { useGoBack } from '../../../utils/navigation'

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

const ExerciseSearchInput = memo(function ExerciseSearchInput({
	onDebouncedChange,
	isFetching,
}: {
	onDebouncedChange: (val: string) => void
	isFetching: boolean
}) {
	const [value, setValue] = useState('')
	const [debounced] = useDebouncedValue(value, 300)

	useEffect(() => {
		onDebouncedChange(debounced)
	}, [debounced, onDebouncedChange])

	return (
		<TextInput
			placeholder="Pesquisar..."
			value={value}
			onChange={(event) => setValue(event.currentTarget.value)}
			leftSection={<Search size={16} />}
			rightSection={isFetching ? <Loader size={14} /> : undefined}
			size="md"
			radius="md"
		/>
	)
})

const ExerciseCardItem = memo(function ExerciseCardItem({
	exercise,
	onSelect,
}: {
	exercise: ExerciseDTO
	onSelect: (id: string) => void
}) {
	const imagePath = exercise.images?.[0]
	const exerciseImageUrl = getExerciseImageUrl(imagePath, true)

	return (
		<Card
			withBorder
			p="sm"
			radius="md"
			style={{ cursor: 'pointer' }}
			onClick={() => onSelect(exercise.id)}
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
})

export function ExerciseSearchPage() {
	const navigate = useNavigate()
	const goBack = useGoBack('/workout')
	const [debouncedSearch, setDebouncedSearch] = useState('')
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
	const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null)

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

	const allMuscles = useMemo(
		() =>
			Array.from(new Set(allCatalogExercises.flatMap((e) => e.primaryMuscles)))
				.filter((m) => m && m !== 'admin-to-delete' && m !== 'chest')
				.map((m) => ({
					label: LOCALIZED_LABELS[m.toLowerCase()] || m.charAt(0).toUpperCase() + m.slice(1),
					value: m,
				}))
				.sort((a, b) => a.label.localeCompare(b.label)),
		[allCatalogExercises]
	)

	const allCategories = useMemo(
		() =>
			Array.from(new Set(allCatalogExercises.map((e) => e.category)))
				.filter((c) => c && c !== 'admin-to-delete' && c !== 'streghnt')
				.map((c) => ({
					label: LOCALIZED_LABELS[c.toLowerCase()] || c.charAt(0).toUpperCase() + c.slice(1),
					value: c,
				}))
				.sort((a, b) => a.label.localeCompare(b.label)),
		[allCatalogExercises]
	)

	// Infinite Query: Fetches exercises per page from the backend database with active filters
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isFetching,
	} = useInfiniteQuery<ExerciseDTO[]>({
		queryKey: ['exercise-catalog-infinite', debouncedSearch, selectedCategory, selectedMuscle],
		queryFn: async ({ pageParam }) => {
			const res = await api.get('/workout/exercise-catalog', {
				params: {
					name: debouncedSearch || undefined,
					category: selectedCategory || undefined,
					primaryMuscles: selectedMuscle || undefined,
					take: debouncedSearch ? 30 : 10,
					cursorId: pageParam || undefined,
				},
			})
			return res.data
		},
		initialPageParam: undefined,
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 5,
		getNextPageParam: (lastPage: ExerciseDTO[]) => {
			if (debouncedSearch) return undefined
			if (lastPage.length < 10) return undefined
			return lastPage[lastPage.length - 1].id
		},
	})

	// Flatten all pages of exercises into a single list
	const exercisesList = useMemo(() => data?.pages.flatMap((page) => page) || [], [data])

	const handleSelectExercise = useCallback(
		(id: string) => {
			navigate(`/workout/exercises/${id}`)
		},
		[navigate]
	)

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
		<MainLayout title="Exercícios" onBack={() => goBack('/workout')}>
			<Container size="xs" px={0}>
				<Stack gap="md">
					{/* Search input isolated from parent re-renders */}
					<ExerciseSearchInput
						onDebouncedChange={setDebouncedSearch}
						isFetching={isFetching && !isFetchingNextPage}
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
								{exercisesList.map((exercise) => (
									<ExerciseCardItem
										key={exercise.id}
										exercise={exercise}
										onSelect={handleSelectExercise}
									/>
								))}

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
