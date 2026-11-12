import type { Result } from '@ate-a-falha/shared'

export interface SharedResourceRecord {
	id: string
	name: string
}

export interface IShareRepository {
	findExportedPlanByCodePrefix(prefix: string): Promise<Result<SharedResourceRecord | null>>
	findExportedDietByCodePrefix(prefix: string): Promise<Result<SharedResourceRecord | null>>
}
