import { useState, useEffect, useRef, useCallback } from 'react'
import {
	Modal,
	Stack,
	Text,
	Group,
	Button,
	TextInput,
	SegmentedControl,
	Alert,
	Box,
	Center,
	Loader,
} from '@mantine/core'
import { QrCode, Hash, CameraOff, Search, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import jsQR from 'jsqr'
import { api } from '../api/axiosInstance'
import { ShareLogic, type ShareLookupResponseDTO } from '@ate-a-falha/shared'

interface ImportRoutineModalProps {
	opened: boolean
	onClose: () => void
	defaultMode?: 'code' | 'camera'
}

export function ImportRoutineModal({ opened, onClose, defaultMode = 'code' }: ImportRoutineModalProps) {
	const navigate = useNavigate()
	const [mode, setMode] = useState<'code' | 'camera'>(defaultMode)
	const [codeInput, setCodeInput] = useState('')
	const [isSearching, setIsSearching] = useState(false)
	const [errorMsg, setErrorMsg] = useState<string | null>(null)
	const [cameraLoading, setCameraLoading] = useState(false)
	const [cameraError, setCameraError] = useState<string | null>(null)

	const videoRef = useRef<HTMLVideoElement | null>(null)
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const streamRef = useRef<MediaStream | null>(null)
	const rafRef = useRef<number | null>(null)
	const isProcessingScanRef = useRef(false)

	const stopCamera = useCallback(() => {
		if (rafRef.current !== null) {
			cancelAnimationFrame(rafRef.current)
			rafRef.current = null
		}
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop())
			streamRef.current = null
		}
		if (videoRef.current) {
			videoRef.current.srcObject = null
		}
	}, [])

	const resolveAndNavigate = useCallback(
		async (rawInput: string) => {
			setErrorMsg(null)
			const parsed = ShareLogic.parseShareInput(rawInput)

			if (!parsed) {
				setErrorMsg('Formato inválido. Digite um código como T-A1B2C3, D-9F8E7D ou cole um link válido.')
				isProcessingScanRef.current = false
				return
			}

			// If a full 36-char UUID + resourceType was scanned directly from a QR URL, we can verify via lookup or navigate
			setIsSearching(true)
			try {
				const lookupParam = parsed.resourceType
					? `${parsed.resourceType === 'workout' ? 'T' : 'D'}-${parsed.codeOrId}`
					: parsed.codeOrId

				const res = await api.get<ShareLookupResponseDTO>(`/share/lookup/${encodeURIComponent(lookupParam)}`)
				const { resourceType, resourceId } = res.data

				stopCamera()
				onClose()
				navigate(`/share/${resourceType}/${resourceId}`)
			} catch {
				setErrorMsg('Rotina não encontrada ou o autor desativou o compartilhamento público.')
				isProcessingScanRef.current = false
			} finally {
				setIsSearching(false)
			}
		},
		[navigate, onClose, stopCamera]
	)

	// Start/stop camera when modal opens in 'camera' mode
	useEffect(() => {
		if (!opened || mode !== 'camera') {
			stopCamera()
			return
		}

		let cancelled = false
		isProcessingScanRef.current = false
		setCameraError(null)
		setErrorMsg(null)
		setCameraLoading(true)

		async function initCamera() {
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
				setCameraError('Seu navegador não suporta acesso direto à câmera. Utilize a aba de código.')
				setCameraLoading(false)
				return
			}

			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: { ideal: 'environment' } },
					audio: false,
				})

				if (cancelled) {
					stream.getTracks().forEach((t) => t.stop())
					return
				}

				streamRef.current = stream
				if (videoRef.current) {
					videoRef.current.srcObject = stream
					videoRef.current.setAttribute('playsinline', 'true')
					await videoRef.current.play()
				}
				setCameraLoading(false)

				const scanFrame = () => {
					if (cancelled || isProcessingScanRef.current) return

					const video = videoRef.current
					const canvas = canvasRef.current
					if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
						const ctx = canvas.getContext('2d', { willReadFrequently: true })
						if (ctx) {
							canvas.width = video.videoWidth
							canvas.height = video.videoHeight
							ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
							const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
							const code = jsQR(imageData.data, imageData.width, imageData.height, {
								inversionAttempts: 'dontInvert',
							})

							if (code && code.data) {
								isProcessingScanRef.current = true
								stopCamera()
								void resolveAndNavigate(code.data)
								return
							}
						}
					}

					rafRef.current = requestAnimationFrame(scanFrame)
				}

				rafRef.current = requestAnimationFrame(scanFrame)
			} catch {
				if (!cancelled) {
					setCameraError(
						'Não foi possível acessar a câmera. Verifique as permissões do navegador ou digite o código manualmente.'
					)
					setCameraLoading(false)
				}
			}
		}

		void initCamera()

		return () => {
			cancelled = true
			stopCamera()
		}
	}, [opened, mode, stopCamera, resolveAndNavigate])

	// Reset state when modal closes
	const handleClose = () => {
		stopCamera()
		setErrorMsg(null)
		setCameraError(null)
		setCodeInput('')
		onClose()
	}

	const handleSubmitCode = (e: React.FormEvent) => {
		e.preventDefault()
		if (!codeInput.trim()) return
		void resolveAndNavigate(codeInput)
	}

	return (
		<Modal
			opened={opened}
			onClose={handleClose}
			title={
				<Group gap="xs">
					<QrCode size={18} />
					<Text fw={700}>Importar Rotina Compartilhada</Text>
				</Group>
			}
			centered
			radius="md"
		>
			<Stack gap="md">
				<SegmentedControl
					fullWidth
					value={mode}
					onChange={(val) => {
						setErrorMsg(null)
						setMode(val as 'code' | 'camera')
					}}
					data={[
						{
							value: 'code',
							label: (
								<Center style={{ gap: 8 }}>
									<Hash size={15} />
									<span>Digitar Código</span>
								</Center>
							),
						},
						{
							value: 'camera',
							label: (
								<Center style={{ gap: 8 }}>
									<QrCode size={15} />
									<span>Escanear QR Code</span>
								</Center>
							),
						},
					]}
				/>

				{errorMsg && (
					<Alert
						color="red"
						variant="light"
						title="Não foi possível localizar"
						icon={<AlertCircle size={16} />}
					>
						{errorMsg}
					</Alert>
				)}

				{mode === 'code' ? (
					<form onSubmit={handleSubmitCode}>
						<Stack gap="md">
							<Text size="xs" c="dimmed">
								Insira o código curto informado pelo autor (ex: <strong>T-A1B2C3</strong> para treino ou{' '}
								<strong>D-9F8E7D</strong> para dieta) ou cole o link de compartilhamento.
							</Text>

							<TextInput
								label="Código ou Link da Rotina"
								placeholder="Ex: T-A1B2C3"
								value={codeInput}
								onChange={(e) => {
									const val = e.currentTarget.value
									setCodeInput(val.includes('/') ? val : val.toUpperCase())
								}}
								required
								autoFocus
								styles={{
									input: {
										fontFamily: 'monospace',
										fontWeight: 700,
										letterSpacing: '1px',
									},
								}}
							/>

							<Button
								type="submit"
								fullWidth
								leftSection={<Search size={16} />}
								loading={isSearching}
								disabled={codeInput.trim().length < 6}
							>
								Buscar e Visualizar Rotina
							</Button>
						</Stack>
					</form>
				) : (
					<Stack gap="md" align="center">
						<Text size="xs" c="dimmed" ta="center">
							Aponte a câmera para o QR Code exibido no aplicativo de outro usuário.
						</Text>

						{cameraError ? (
							<Alert
								color="yellow"
								variant="light"
								title="Câmera indisponível"
								icon={<CameraOff size={16} />}
								w="100%"
							>
								<Stack gap="xs">
									<Text size="xs">{cameraError}</Text>
									<Button size="xs" variant="light" onClick={() => setMode('code')}>
										Digitar código manualmente
									</Button>
								</Stack>
							</Alert>
						) : (
							<Box
								style={{
									position: 'relative',
									width: '100%',
									maxWidth: 300,
									aspectRatio: '1 / 1',
									borderRadius: 12,
									overflow: 'hidden',
									backgroundColor: '#000',
									border: '2px solid var(--mantine-color-dark-4)',
								}}
							>
								{cameraLoading && (
									<Center style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
										<Stack align="center" gap="xs">
											<Loader size="md" color="blue" />
											<Text size="xs" c="dimmed">
												Iniciando câmera...
											</Text>
										</Stack>
									</Center>
								)}
								<video
									ref={videoRef}
									muted
									playsInline
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
									}}
								/>
								{/* Framing reticle overlay */}
								<Box
									style={{
										position: 'absolute',
										inset: '18%',
										border: '2px dashed rgba(51, 154, 240, 0.85)',
										borderRadius: 12,
										pointerEvents: 'none',
										boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.35)',
									}}
								/>
								<canvas ref={canvasRef} style={{ display: 'none' }} />
							</Box>
						)}
					</Stack>
				)}
			</Stack>
		</Modal>
	)
}
