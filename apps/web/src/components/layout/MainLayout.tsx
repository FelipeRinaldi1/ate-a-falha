import { type ReactNode } from 'react'
import { AppShell, Drawer } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { DesktopNavbar } from './DesktopNavbar.js'
import { MobileNavbar } from './MobileNavbar.js'
import { Header } from './Header.js'
import { Footer } from './Footer.js'

interface MainLayoutProps {
	children?: ReactNode
	showSearch?: boolean
	actions?: ReactNode
}

export function MainLayout({ children, showSearch = true, actions }: MainLayoutProps) {
	const [opened, { toggle, close }] = useDisclosure()

	return (
		<AppShell
			padding="md"
			header={{ height: 60 }}
			navbar={{ width: { base: '70vw', sm: 200, lg: 300 }, breakpoint: 'sm', collapsed: { mobile: true } }}
			footer={{ height: { base: 60, sm: 0 } }}
		>
			<Header opened={opened} onToggle={toggle} showSearch={showSearch} actions={actions} />

			<AppShell.Navbar>
				<DesktopNavbar />
			</AppShell.Navbar>

			<Drawer opened={opened} onClose={close}>
				<MobileNavbar />
			</Drawer>

			<AppShell.Main>
				{children}
			</AppShell.Main>

			<Footer />
		</AppShell>
	)
}
