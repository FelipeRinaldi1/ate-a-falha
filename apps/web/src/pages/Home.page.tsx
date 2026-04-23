import { Stack, ActionIcon, AppShell, Burger, Group, TextInput, Text, UnstyledButton, Drawer } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import { Search, Apple, Dumbbell, User } from 'lucide-react'

export function HomePage() {
	const [opened, { toggle, close }] = useDisclosure()

	return (
		<AppShell
			padding="md"
			header={{ height: 60 }}
			navbar={{ width: { base: '70vw', sm: 200, lg: 300 }, breakpoint: 'sm', collapsed: { mobile: true } }}
			footer={{ height: { base: 60, sm: 0 } }}
		>
			<AppShell.Header>
				<Group h="100%" justify="space-evenly">
					<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size={'sm'}></Burger>
					<TextInput></TextInput>
					<ActionIcon>
						<Search size="20"></Search>
					</ActionIcon>
				</Group>
			</AppShell.Header>

			<AppShell.Navbar>
				<Text>Config</Text>
			</AppShell.Navbar>
			<Drawer opened={opened} onClose={close}></Drawer>
			<AppShell.Main></AppShell.Main>

			<AppShell.Footer hiddenFrom="sm">
				<Group grow h="100%" gap={0}>
					<UnstyledButton h="100%">
						<Stack h="100%" justify="center" align="center" gap={4}>
							<Dumbbell size="24"></Dumbbell>
							<Text size="xs" lh={1}>
								Treino
							</Text>
						</Stack>
					</UnstyledButton>
					<UnstyledButton h="100%">
						<Stack h="100%" justify="center" align="center" gap={4}>
							<User size="24"></User>
							<Text size="xs" lh={1}>
								Perfil
							</Text>
						</Stack>
					</UnstyledButton>
					<UnstyledButton h="100%">
						<Stack h="100%" justify="center" align="center" gap={4}>
							<Apple size="24"></Apple>
							<Text size="xs" lh={1}>
								Dieta
							</Text>
						</Stack>
					</UnstyledButton>
				</Group>
			</AppShell.Footer>
		</AppShell>
	)
}
