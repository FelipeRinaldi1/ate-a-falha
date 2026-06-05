import { useState } from 'react'
import { Modal, Switch, Text, Stack, Group, Button, Box } from '@mantine/core'
import { Copy, Check, Share2 } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

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
	const [copied, setCopied] = useState(false)

	const shareUrl = `${window.location.origin}/share/${resourceType}/${resourceId}`

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error('Failed to copy text: ', err)
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
					Ao ativar o compartilhamento, qualquer pessoa com o link ou QR Code poderá visualizar e importar uma cópia deste {resourceType === 'workout' ? 'treino' : 'dieta'}.
				</Text>

				<Switch
					label="Liberar compartilhamento público"
					checked={isExported}
					onChange={(event) => onToggleExport(event.currentTarget.checked)}
					disabled={loading}
				/>

				{isExported && (
					<Stack align="center" gap="md" mt="xs">
						<Box
							style={{
								padding: '16px',
								background: '#fff',
								borderRadius: '12px',
								display: 'inline-block',
								boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
							}}
						>
							<QRCodeSVG value={shareUrl} size={180} />
						</Box>

						<Text size="xs" c="dimmed" style={{ wordBreak: 'break-all', textAlign: 'center' }}>
							{shareUrl}
						</Text>

						<Button
							leftSection={copied ? <Check size={16} /> : <Copy size={16} />}
							color={copied ? 'green' : 'blue'}
							variant="light"
							fullWidth
							onClick={handleCopy}
						>
							{copied ? 'Copiado!' : 'Copiar Link'}
						</Button>
					</Stack>
				)}
			</Stack>
		</Modal>
	)
}
