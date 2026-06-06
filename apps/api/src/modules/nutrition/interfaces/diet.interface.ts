import {
	type CreateDietDTO,
	type UpdateDietDTO,
	type CreateDietLogDTO,
	type UpdateDietLogDTO,
	type Result,
} from '@ate-a-falha/shared'
import { type DietFull, type DietLogFull } from '@ate-a-falha/database'

export interface IDietRepository {
	create(data: CreateDietDTO, userId: string): Promise<Result<DietFull>>

	update(id: string, data: UpdateDietDTO, userId: string): Promise<Result<DietFull>>

	delete(id: string, userId: string): Promise<Result<void>>

	findAll(userId: string): Promise<Result<DietFull[]>>

	findById(id: string, userId: string): Promise<Result<DietFull>>

	findPublicById(id: string): Promise<Result<DietFull>>

	importDiet(targetDietId: string, userId: string): Promise<Result<DietFull>>
}

export interface IDietLogRepository {
	createLog(data: CreateDietLogDTO, userId: string): Promise<Result<DietLogFull>>

	updateLog(id: string, data: UpdateDietLogDTO, userId: string): Promise<Result<DietLogFull>>

	deleteLog(id: string, userId: string): Promise<Result<void>>

	findAllLogs(userId: string): Promise<Result<DietLogFull[]>>

	findLogById(id: string, userId: string): Promise<Result<DietLogFull>>
}
