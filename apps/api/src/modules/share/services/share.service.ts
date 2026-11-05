import { prisma, safeCall } from '@ate-a-falha/database'
import {
	ShareLogic,
	type ShareLookupResponseDTO,
	type Result,
	success,
	failure,
} from '@ate-a-falha/shared'

export class ShareService {
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
			const planResult = await safeCall(
				prisma.plan.findFirst({
					where: {
						id: {
							startsWith: parsed.codeOrId,
							mode: 'insensitive',
						},
						isExported: true,
					},
					select: {
						id: true,
						name: true,
					},
				})
			)

			if (planResult.isSuccess() && planResult.value) {
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
			const dietResult = await safeCall(
				prisma.diet.findFirst({
					where: {
						id: {
							startsWith: parsed.codeOrId,
							mode: 'insensitive',
						},
						isExported: true,
					},
					select: {
						id: true,
						name: true,
					},
				})
			)

			if (dietResult.isSuccess() && dietResult.value) {
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
