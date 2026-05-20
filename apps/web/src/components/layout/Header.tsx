import { AppShell, Burger, Group } from '@mantine/core'
import { HeaderSearch } from './HeaderSearch.js'
import { type ReactNode } from 'react'

interface HeaderProps {
	opened: boolean
	onToggle: () => void
	showSearch?: boolean
	actions?: ReactNode
}

export function Header({ opened, onToggle, showSearch = true, actions }: HeaderProps) {
	return (
		<AppShell.Header>
			<Group h="100%" px="md" align="center" justify="space-between">
				<Group align="center" gap="md">
					<Burger opened={opened} onClick={onToggle} hiddenFrom="sm" size="sm" />
					{showSearch && <HeaderSearch />}
				</Group>

				{actions && <Group>{actions}</Group>}
			</Group>
		</AppShell.Header>
	)
}
