import { ShareLogic, type ShareLookupResponseDTO, type Result, success, failure } from '@ate-a-falha/shared'
import type { IShareRepository } from '../interfaces/share.interface.js'

export class ShareService {
	constructor(private readonly shareRepository: IShareRepository) {}

	async lookupByCode(rawCode: string): Promise<Result<ShareLookupResponseDTO>> {
		const parsed = ShareLogic.parseShareInput(rawCode)

		if (!parsed) {
			return failure({
				type: 'VALIDATION',
				message: 'Código de compartilhamento inválido.',
			})
		}

		// 1. Search in Workout Plans if resourceType is 'workout' or unspecified
		if (!parsed.resourceType || parsed.resourceType === 'workout') {
			const planResult = await this.shareRepository.findExportedPlanByCodePrefix(parsed.codeOrId)

			if (planResult.isFailure()) {
				return failure(planResult.error)
			}

			if (planResult.value) {
				const plan = planResult.value
				return success({
					resourceType: 'workout',
					resourceId: plan.id,
					name: plan.name,
					shareCode: ShareLogic.generateShareCode('workout', plan.id),
				})
			}
		}

		// 2. Search in Diets if resourceType is 'diet' or unspecified
		if (!parsed.resourceType || parsed.resourceType === 'diet') {
			const dietResult = await this.shareRepository.findExportedDietByCodePrefix(parsed.codeOrId)

			if (dietResult.isFailure()) {
				return failure(dietResult.error)
			}

			if (dietResult.value) {
				const diet = dietResult.value
				return success({
					resourceType: 'diet',
					resourceId: diet.id,
					name: diet.name,
					shareCode: ShareLogic.generateShareCode('diet', diet.id),
				})
			}
		}

		return failure({
			type: 'NOT_FOUND',
			message: 'Rotina compartilhada não encontrada ou com compartilhamento desativado.',
		})
	}
}
