import { useState } from 'react'
import { Modal, Switch, Text, Stack, Group, Button, Box, Paper, Divider } from '@mantine/core'
import { Copy, Check, Share2, Hash, Link as LinkIcon } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { ShareLogic } from '@ate-a-falha/shared'

interface ShareModalProps {
	opened: boolean
	onClose: () => void
	resourceId: string
	resourceType: 'workout' | 'diet'
	isExported: boolean
	onToggleExport: (newVal: boolean) => Promise<void>
	loading?: boolean
}

export function ShareModal({
	opened,
	onClose,
	resourceId,
	resourceType,
	isExported,
	onToggleExport,
	loading = false,
}: ShareModalProps) {
	const [copiedLink, setCopiedLink] = useState(false)
	const [copiedCode, setCopiedCode] = useState(false)

	const shareUrl = `${window.location.origin}/share/${resourceType}/${resourceId}`
	const shareCode = resourceId.length >= 6 ? ShareLogic.generateShareCode(resourceType, resourceId) : ''

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl)
			setCopiedLink(true)
			setTimeout(() => setCopiedLink(false), 2000)
		} catch (err) {
			console.error('Failed to copy link: ', err)
		}
	}

	const handleCopyCode = async () => {
		try {
			await navigator.clipboard.writeText(shareCode)
			setCopiedCode(true)
			setTimeout(() => setCopiedCode(false), 2000)
		} catch (err) {
			console.error('Failed to copy code: ', err)
		}
	}

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={
				<Group gap="xs">
					<Share2 size={18} />
					<Text fw={700}>Compartilhar {resourceType === 'workout' ? 'Treino' : 'Dieta'}</Text>
				</Group>
			}
			centered
			radius="md"
		>
			<Stack gap="md">
				<Text size="sm" c="dimmed">
					Ao ativar o compartilhamento, qualquer pessoa com o código, link ou QR Code poderá visualizar e importar uma cópia deste {resourceType === 'workout' ? 'treino' : 'dieta'}.
				</Text>

				<Switch
					label="Liberar compartilhamento público"
					checked={isExported}
					onChange={(event) => onToggleExport(event.currentTarget.checked)}
					disabled={loading}
				/>

				{isExported && (
					<Stack align="center" gap="md" mt="xs">
						{/* Short Code Box */}
						<Paper
							withBorder
							p="sm"
							radius="md"
							w="100%"
							style={{ backgroundColor: 'var(--mantine-color-dark-6)' }}
						>
							<Group justify="space-between" align="center" wrap="nowrap">
								<Stack gap={2}>
									<Group gap={4}>
										<Hash size={12} />
										<Text size="xs" c="dimmed" fw={600}>
											Código Rápido de Importação
										</Text>
									</Group>
									<Text
										fw={900}
										size="xl"
										style={{ letterSpacing: '2px', fontFamily: 'monospace' }}
									>
										{shareCode}
									</Text>
								</Stack>

								<Button
									size="xs"
									variant="light"
									color={copiedCode ? 'green' : 'blue'}
									leftSection={copiedCode ? <Check size={14} /> : <Copy size={14} />}
									onClick={handleCopyCode}
								>
									{copiedCode ? 'Copiado!' : 'Copiar Código'}
								</Button>
							</Group>
						</Paper>

						<Divider w="100%" label="ou escaneie o QR Code" labelPosition="center" />

						<Box
							style={{
								padding: '16px',
								background: '#fff',
								borderRadius: '12px',
								display: 'inline-block',
								boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
							}}
						>
							<QRCodeSVG value={shareUrl} size={170} />
						</Box>

						<Text size="xs" c="dimmed" style={{ wordBreak: 'break-all', textAlign: 'center' }}>
							{shareUrl}
						</Text>

						<Button
							leftSection={copiedLink ? <Check size={16} /> : <LinkIcon size={16} />}
							color={copiedLink ? 'green' : 'gray'}
							variant="light"
							fullWidth
							onClick={handleCopyLink}
						>
							{copiedLink ? 'Link Copiado!' : 'Copiar Link Completo'}
						</Button>
					</Stack>
				)}
			</Stack>
		</Modal>
	)
}
