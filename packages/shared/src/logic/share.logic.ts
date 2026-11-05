export type ShareResourceType = 'workout' | 'diet'

export interface ParsedShareInput {
	resourceType?: ShareResourceType
	codeOrId: string
}

export interface ShareLookupResponseDTO {
	resourceType: ShareResourceType
	resourceId: string
	name: string
	shareCode: string
}

export class ShareLogic {
	/**
	 * Generates a deterministic, human-friendly short code (e.g., "T-A1B2C3" or "D-9F8E7D")
	 * from the resource type and its UUID.
	 */
	static generateShareCode(resourceType: ShareResourceType, id: string): string {
		const clean = (id || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
		if (clean.length < 6) {
			throw new Error('Invalid resource ID for share code generation.')
		}
		const prefix = resourceType === 'workout' ? 'T' : 'D'
		return `${prefix}-${clean.slice(0, 6)}`
	}

	/**
	 * Parses a user-entered code, raw UUID, or full QR Code URL into a structured lookup query.
	 * Returns null if the input is malformed or too short.
	 */
	static parseShareInput(rawInput: string): ParsedShareInput | null {
		if (!rawInput || typeof rawInput !== 'string') return null

		const trimmed = rawInput.trim()
		if (!trimmed) return null

		// 1. Check if input is a full URL or path like ".../share/workout/:id" or ".../share/diet/:id"
		const urlMatch = trimmed.match(/\/share\/(workout|diet)\/([a-zA-Z0-9-]+)\/?(?:\?.*)?$/i)
		if (urlMatch && urlMatch[1] && urlMatch[2]) {
			const urlType = urlMatch[1].toLowerCase() as ShareResourceType
			const rawSegment = urlMatch[2]
			const nested = ShareLogic.parseShareInput(rawSegment)
			if (!nested) return null
			return {
				resourceType: urlType,
				codeOrId: nested.codeOrId,
			}
		}

		// 2. Check if input has a workout prefix: T-XXXXXX or W-XXXXXX
		const workoutPrefixMatch = trimmed.match(/^[TW]-?([0-9a-fA-F]{6,8}(?:-[0-9a-fA-F-]{4,28})?)$/i)
		if (workoutPrefixMatch && workoutPrefixMatch[1]) {
			return {
				resourceType: 'workout',
				codeOrId: workoutPrefixMatch[1].toLowerCase(),
			}
		}

		// 3. Check if input has a diet prefix: D-XXXXXX
		const dietPrefixMatch = trimmed.match(/^D-?([0-9a-fA-F]{6,8}(?:-[0-9a-fA-F-]{4,28})?)$/i)
		if (dietPrefixMatch && dietPrefixMatch[1]) {
			return {
				resourceType: 'diet',
				codeOrId: dietPrefixMatch[1].toLowerCase(),
			}
		}

		// 4. Check if input is a full UUID or a raw 6-8 char hex prefix
		const uuidOrHexMatch = trimmed.match(
			/^([0-9a-fA-F]{6,8}(?:-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})?)$/
		)
		if (uuidOrHexMatch && uuidOrHexMatch[1]) {
			return {
				resourceType: undefined,
				codeOrId: uuidOrHexMatch[1].toLowerCase(),
			}
		}

		return null
	}
}
