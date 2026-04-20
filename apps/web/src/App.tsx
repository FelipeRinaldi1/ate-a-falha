import { useForm, schemaResolver } from '@mantine/form'
import { TextInput, NumberInput, Button, Container, Title, Stack, Text, Paper, Divider } from '@mantine/core'
import '@mantine/core/styles.css'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './api/instance.js'
import { createFoodSchema, type FoodDTO, type CreateFoodDTO } from '@ate-a-falha/shared'

export function FoodForm({ onAddFood, isLoading }: { onAddFood: (food: CreateFoodDTO) => void; isLoading: boolean }) {
	const form = useForm<CreateFoodDTO>({
		initialValues: {
			name: '',
			calories: 0,
			carbohydrate: 0,
			protein: 0,
			lipids: 0,
			fiber: 0,
		},
		validate: schemaResolver(createFoodSchema, { sync: true }),
	})

	return (
		<Paper withBorder p="md" radius="md" shadow="xs">
			<form onSubmit={form.onSubmit((values) => onAddFood(values))}>
				<Stack>
					<Title order={3}>Add New Food</Title>
					<TextInput
						label="Name"
						placeholder="e.g. Chicken Breast"
						required
						{...form.getInputProps('name')}
					/>
					<NumberInput label="Calories (kcal)" required {...form.getInputProps('calories')} />
					<NumberInput label="Carbohydrates (g)" {...form.getInputProps('carbohydrate')} />
					<NumberInput label="Protein (g)" {...form.getInputProps('protein')} />
					<NumberInput label="Lipids (g)" {...form.getInputProps('lipids')} />
					<NumberInput label="Fiber (g)" {...form.getInputProps('fiber')} />
					<Button type="submit" loading={isLoading} fullWidth>
						Save Food
					</Button>
				</Stack>
			</form>
		</Paper>
	)
}

export function App() {
	const queryClient = useQueryClient()

	const { data: foods, isLoading } = useQuery({
		queryKey: ['foods'],
		queryFn: async () => {
			const { data } = await api.get<FoodDTO[]>('/foods')
			return data
		},
	})

	const mutation = useMutation({
		mutationFn: (newFood: CreateFoodDTO) => {
			return api.post('/foods', newFood)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['foods'] })
		},
	})

	if (isLoading) return <Text>Loading dashboard...</Text>

	return (
		<Container size="sm" py="xl">
			<Stack gap="xl">
				<Title order={1} c="blue">
					Ate a Falha - Dashboard
				</Title>

				<FoodForm onAddFood={(values) => mutation.mutate(values)} isLoading={mutation.isPending} />

				<Divider label="Your Food Database" labelPosition="center" />

				<Stack gap="xs">
					{foods?.length === 0 && <Text c="dimmed">No foods found. Start by adding one!</Text>}
					{foods?.map((food) => (
						<Paper key={food.id} withBorder p="sm" radius="md">
							<Text fw={700}>{food.name}</Text>
							<Text size="sm" c="dimmed">
								{food.calories} kcal | P: {food.protein}g | C: {food.carbohydrate}g | F: {food.lipids}g
							</Text>
						</Paper>
					))}
				</Stack>
			</Stack>
		</Container>
	)
}
