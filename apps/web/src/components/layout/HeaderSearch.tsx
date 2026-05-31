import { ActionIcon, TextInput, Group } from '@mantine/core'
import { Search } from 'lucide-react'

export function HeaderSearch() {
	return (
		<Group gap="xs" style={{ flex: 1, maxWidth: 300, flexWrap: 'nowrap' }} align="center">
			<TextInput placeholder="Pesquisar..." radius="md" size="sm" style={{ flex: 1 }} />
			<ActionIcon size="36" radius="md" variant="filled">
				<Search size="18" />
			</ActionIcon>
		</Group>
	)
}
