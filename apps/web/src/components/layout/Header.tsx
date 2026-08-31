import { AppShell, Group, ActionIcon, Text } from '@mantine/core'
import { type ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'

interface HeaderProps {
	actions?: ReactNode
	onBack?: () => void
	title?: string
}

export function Header({ actions, onBack, title }: HeaderProps) {
	return (
		<AppShell.Header>
			<Group h="100%" px="md" align="center" justify="space-between" style={{ position: 'relative' }}>
				{/* Left Side: Back Button or Placeholder */}
				<Group align="center" gap="md">
					{onBack ? (
						<ActionIcon variant="subtle" onClick={onBack} size="md" c="dimmed">
							<ArrowLeft size={20} />
						</ActionIcon>
					) : (
						<div style={{ width: 28 }} />
					)}
				</Group>

				{/* Center: Absolutely Centered Title */}
				{title && (
					<Text
						fw={700}
						size="md"
						style={{
							position: 'absolute',
							left: '50%',
							transform: 'translateX(-50%)',
							pointerEvents: 'none',
						}}
					>
						{title}
					</Text>
				)}

				{/* Right Side: Actions */}
				<Group>{actions}</Group>
			</Group>
		</AppShell.Header>
	)
}
