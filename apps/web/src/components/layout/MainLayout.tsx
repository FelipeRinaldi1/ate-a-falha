import { type ReactNode } from 'react'
import { AppShell } from '@mantine/core'
import { DesktopNavbar } from './DesktopNavbar.js'
import { Header } from './Header.js'
import { Footer } from './Footer.js'

interface MainLayoutProps {
	children?: ReactNode
	actions?: ReactNode
	onBack?: () => void
	title?: string
}

export function MainLayout({ children, actions, onBack, title }: MainLayoutProps) {
	return (
		<AppShell
			padding="md"
			header={{ height: 60 }}
			navbar={{ width: { base: '70vw', sm: 200, lg: 300 }, breakpoint: 'sm', collapsed: { mobile: true } }}
			footer={{ height: { base: 60, sm: 0 } }}
		>
			<Header actions={actions} onBack={onBack} title={title} />

			<AppShell.Navbar>
				<DesktopNavbar />
			</AppShell.Navbar>

			<AppShell.Main>{children}</AppShell.Main>

			<Footer />
		</AppShell>
	)
}
