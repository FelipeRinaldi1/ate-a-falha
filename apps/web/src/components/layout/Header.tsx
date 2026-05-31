import { AppShell, Burger, Group, ActionIcon } from '@mantine/core'
import { HeaderSearch } from './HeaderSearch.js'
import { type ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'

interface HeaderProps {
	opened: boolean
	onToggle: () => void
	showSearch?: boolean
	actions?: ReactNode
	onBack?: () => void
}

export function Header({ opened, onToggle, showSearch = true, actions, onBack }: HeaderProps) {
	return (
		<AppShell.Header>
			<Group h="100%" px="md" align="center" justify="space-between">
				<Group align="center" gap="md">
					{onBack ? (
						<ActionIcon variant="subtle" onClick={onBack} size="md" c="dimmed">
							<ArrowLeft size={20} />
						</ActionIcon>
					) : (
						<Burger opened={opened} onClick={onToggle} hiddenFrom="sm" size="sm" />
					)}
					{showSearch && <HeaderSearch />}
				</Group>

				{actions && <Group>{actions}</Group>}
			</Group>
		</AppShell.Header>
	)
}
