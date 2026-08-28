/**
 * Resolves the absolute URL for an exercise image or thumbnail.
 *
 * @param imagePath - e.g. "Barbell_Bench_Press_-_Medium_Grip/0.jpg"
 * @param isThumbnail - whether to return the lightweight 200px thumbnail (0_thumb.webp)
 */
export function getExerciseImageUrl(imagePath?: string | null, isThumbnail: boolean = false): string {
	if (!imagePath || imagePath === 'placeholder') {
		return 'https://placehold.co/400x300?text=Exercicio'
	}

	if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
		return imagePath
	}

	const rawUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1').trim().replace(/\/$/, '')
	const apiBaseUrl = rawUrl.endsWith('/api/v1') ? rawUrl : `${rawUrl}/api/v1`

	let fileName = imagePath.endsWith('.webp') ? imagePath : imagePath.replace(/\.[^/.]+$/, '.webp')

	if (isThumbnail) {
		if (fileName.endsWith('/0.webp')) {
			fileName = fileName.replace(/\/0\.webp$/, '/0_thumb.webp')
		} else if (fileName === '0.webp') {
			fileName = '0_thumb.webp'
		}
	}

	return `${apiBaseUrl}/assets/exercises/${fileName}`
}
