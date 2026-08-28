import { type Result } from '@ate-a-falha/shared'

export interface IUserAccessControlRepository {
	canAccessBodyMetric(bodyMetricId: string, userId: string): Promise<Result<boolean>>
}
