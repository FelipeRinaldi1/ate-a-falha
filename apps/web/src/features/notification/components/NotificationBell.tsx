import { useState } from 'react'
import {
	Popover,
	ActionIcon,
	Indicator,
	Text,
	Group,
	Stack,
	ScrollArea,
	Button,
	Divider,
	Box,
	UnstyledButton,
	Badge,
	ThemeIcon,
	Tooltip,
} from '@mantine/core'
import {
	Bell,
	CheckCheck,
	Trash2,
	Dumbbell,
	Utensils,
	Info,
	AlertTriangle,
	CheckCircle2,
	Sparkles,
} from 'lucide-react'
import {
	useNotifications,
	useUnreadNotificationCount,
	useMarkAsRead,
	useMarkAllAsRead,
	useDeleteNotification,
	useClearAllNotifications,
} from '../hooks/useNotifications'
import type { NotificationDTO, NotificationType } from '@ate-a-falha/shared'
import { useNavigate } from 'react-router-dom'

function formatRelativeTime(dateString: string | Date): string {
	const date = new Date(dateString)
	const now = new Date()
	const diffMs = now.getTime() - date.getTime()
	const diffMinutes = Math.floor(diffMs / (1000 * 60))
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

	if (diffMinutes < 1) return 'Agora mesmo'
	if (diffMinutes < 60) return `Há ${diffMinutes} min`
	if (diffHours < 24) return `Há ${diffHours} h`
	if (diffDays === 1) return 'Ontem'
	if (diffDays < 7) return `Há ${diffDays} dias`
	return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function getNotificationIcon(type: NotificationType) {
	switch (type) {
		case 'WORKOUT':
			return {
				icon: <Dumbbell size={16} />,
				color: 'orange',
			}
		case 'DIET':
			return {
				icon: <Utensils size={16} />,
				color: 'green',
			}
		case 'SUCCESS':
			return {
				icon: <CheckCircle2 size={16} />,
				color: 'teal',
			}
		case 'WARNING':
			return {
				icon: <AlertTriangle size={16} />,
				color: 'yellow',
			}
		case 'SYSTEM':
			return {
				icon: <Sparkles size={16} />,
				color: 'violet',
			}
		case 'INFO':
		default:
			return {
				icon: <Info size={16} />,
				color: 'blue',
			}
	}
}

export function NotificationBell() {
	const [opened, setOpened] = useState(false)
	const navigate = useNavigate()

	const { data: unreadCount = 0 } = useUnreadNotificationCount()
	const { data: notificationsData, isLoading } = useNotifications({ take: 30 })

	const markAsReadMutation = useMarkAsRead()
	const markAllAsReadMutation = useMarkAllAsRead()
	const deleteNotificationMutation = useDeleteNotification()
	const clearAllMutation = useClearAllNotifications()

	const notifications = notificationsData?.notifications || []

	const handleNotificationClick = (notification: NotificationDTO) => {
		if (!notification.read) {
			markAsReadMutation.mutate(notification.id)
		}

		if (notification.link) {
			setOpened(false)
			navigate(notification.link)
		}
	}

	const handleMarkAllAsRead = () => {
		markAllAsReadMutation.mutate()
	}

	const handleClearAll = () => {
		clearAllMutation.mutate()
	}

	const handleDeleteOne = (e: React.MouseEvent, id: string) => {
		e.stopPropagation()
		deleteNotificationMutation.mutate(id)
	}

	return (
		<Popover
			opened={opened}
			onChange={setOpened}
			position="bottom-end"
			withArrow
			shadow="md"
			width={360}
		>
			<Popover.Target>
				<Indicator
					disabled={unreadCount === 0}
					label={unreadCount > 99 ? '99+' : unreadCount}
					size={18}
					color="red"
					offset={4}
				>
					<ActionIcon
						variant="subtle"
						size="lg"
						radius="md"
						onClick={() => setOpened((o) => !o)}
						aria-label="Abrir notificações"
					>
						<Bell size={20} />
					</ActionIcon>
				</Indicator>
			</Popover.Target>

			<Popover.Dropdown p={0}>
				{/* Popover Header */}
				<Group justify="space-between" align="center" px="md" py="xs">
					<Group gap="xs">
						<Text fw={700} size="sm">
							Notificações
						</Text>
						{unreadCount > 0 && (
							<Badge size="xs" color="red" variant="filled" radius="sm">
								{unreadCount} novas
							</Badge>
						)}
					</Group>

					{unreadCount > 0 && (
						<Tooltip label="Marcar todas como lidas" position="left">
							<ActionIcon
								variant="subtle"
								size="sm"
								color="gray"
								onClick={handleMarkAllAsRead}
								loading={markAllAsReadMutation.isPending}
							>
								<CheckCheck size={16} />
							</ActionIcon>
						</Tooltip>
					)}
				</Group>

				<Divider />

				{/* Notifications List */}
				<ScrollArea.Autosize mah={380} type="auto">
					{isLoading ? (
						<Box p="xl" style={{ textAlign: 'center' }}>
							<Text size="sm" c="dimmed">
								Carregando notificações...
							</Text>
						</Box>
					) : notifications.length === 0 ? (
						<Stack align="center" justify="center" py="xl" gap="xs">
							<ThemeIcon size={44} radius="xl" variant="light" color="gray">
								<Bell size={22} />
							</ThemeIcon>
							<Text fw={500} size="sm" c="dimmed">
								Nenhuma notificação por aqui
							</Text>
							<Text size="xs" c="dimmed" style={{ textAlign: 'center', maxWidth: 220 }}>
								Você receberá avisos sobre seus treinos, dietas e metas.
							</Text>
						</Stack>
					) : (
						<Stack gap={0}>
							{notifications.map((notif) => {
								const iconConfig = getNotificationIcon(notif.type as NotificationType)

								return (
									<UnstyledButton
										key={notif.id}
										onClick={() => handleNotificationClick(notif)}
										px="md"
										py="sm"
										style={(theme) => ({
											borderBottom: `1px solid ${theme.colors.gray?.[2] || '#2C2E33'}`,
											backgroundColor: notif.read
												? 'transparent'
												: 'var(--mantine-color-blue-light)',
											transition: 'background-color 150ms ease',
											'&:hover': {
												backgroundColor: 'var(--mantine-color-default-hover)',
											},
											position: 'relative',
										})}
									>
										<Group align="flex-start" gap="sm" wrap="nowrap">
											<ThemeIcon
												size={32}
												radius="md"
												variant="light"
												color={iconConfig.color}
												style={{ flexShrink: 0, marginTop: 2 }}
											>
												{iconConfig.icon}
											</ThemeIcon>

											<Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
												<Group justify="space-between" align="baseline" gap="xs">
													<Text
														fw={notif.read ? 600 : 700}
														size="xs"
														truncate
														style={{ flex: 1 }}
													>
														{notif.title}
													</Text>
													<Text size="10px" c="dimmed" style={{ flexShrink: 0 }}>
														{formatRelativeTime(notif.createdAt)}
													</Text>
												</Group>

												<Text size="xs" c="dimmed" lineClamp={2}>
													{notif.message}
												</Text>
											</Stack>

											<ActionIcon
												variant="subtle"
												size="xs"
												color="gray"
												onClick={(e) => handleDeleteOne(e, notif.id)}
												style={{ opacity: 0.6, flexShrink: 0 }}
											>
												<Trash2 size={13} />
											</ActionIcon>
										</Group>
									</UnstyledButton>
								)
							})}
						</Stack>
					)}
				</ScrollArea.Autosize>

				{/* Popover Footer */}
				{notifications.length > 0 && (
					<>
						<Divider />
						<Group justify="flex-end" px="md" py="xs">
							<Button
								variant="subtle"
								color="gray"
								size="compact-xs"
								leftSection={<Trash2 size={12} />}
								onClick={handleClearAll}
								loading={clearAllMutation.isPending}
							>
								Limpar todas
							</Button>
						</Group>
					</>
				)}
			</Popover.Dropdown>
		</Popover>
	)
}
