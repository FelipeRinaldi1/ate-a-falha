import { Center, Paper, Stack, Group, Text, Title, Avatar } from '@mantine/core'
import { MainLayout } from '../components/layout/MainLayout'
import { Flame, Ruler, Scale, Weight } from 'lucide-react'

export function ProfilePage() {
	return (
		<MainLayout showSearch={false}>
			<Paper withBorder={true} p="md" w="100%" shadow={'xl'}>
				<Stack align="center" justify="flex-start">
					<Center>
						<Avatar size={128} alt="Minha foto"></Avatar>
					</Center>
					<Title>Meu Nome</Title>
					<Paper withBorder={true} w="100%" p="sm" shadow="xl">
						<Stack align="center" justify="flex-start">
							<Title size={'xl'}>Metricas Corporais</Title>
							<Group gap={'xs'}>
								<Ruler size={24}></Ruler>
								<Text size="md">Altura: 177cm</Text>
							</Group>
							<Group gap={'xs'}>
								<Weight size={24}></Weight>
								<Text size="md">Peso: 90kg</Text>
							</Group>
							<Group>
								<Scale size={24}></Scale>
								<Text size="md">IMC: 26.8</Text>
							</Group>
						</Stack>
					</Paper>
					<Paper withBorder={true} w="100%" p="md" shadow="xl">
						<Stack align="center" justify="flex-start">
							<Title size={'xl'}>Gasto Calórico</Title>
							<Group gap="xs">
								<Flame size={24}></Flame>
								<Text size="md">Nivel de atividade Física: 1</Text>
							</Group>
							<Group gap="xs">
								<Flame size={24}></Flame>
								<Text size="md">Gasto Metabolico Basal: 1800</Text>
							</Group>
							<Group gap="xs">
								<Flame size={24}></Flame>
								<Text size="md">Gasto Metabolico Total: 2500</Text>
							</Group>
						</Stack>
					</Paper>
					<Paper withBorder={true} w="100%" p="md" shadow="xl">
						<Stack align="center" justify="flex-start">
							<Title size={'xl'}>Metricas Avançadas</Title>
							<Group gap="xs">
								<Text size="md">Porcentagem Gordura Corporal: 24%</Text>
							</Group>
							<Group gap="xs">
								<Text size="md">Porcentagem Massa Muscular: 36%</Text>
							</Group>
							<Group gap="xs">
								<Text size="md">Porcentagem Massa Magra: 40%</Text>
							</Group>
						</Stack>
					</Paper>
				</Stack>
			</Paper>
		</MainLayout>
	)
}
