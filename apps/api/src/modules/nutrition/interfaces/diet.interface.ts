import { type CreateDietDTO, type UpdateDietDTO, type Result } from '@ate-a-falha/shared'
import { type DietFull } from '@ate-a-falha/database'

export interface IDietRepository {
	create(data: CreateDietDTO, userId: string): Promise<Result<DietFull>>

	update(id: string, data: UpdateDietDTO, userId: string): Promise<Result<DietFull>>

	delete(id: string, userId: string): Promise<Result<void>>

	findAll(userId: string): Promise<Result<DietFull[]>>

	findById(id: string, userId: string): Promise<Result<DietFull>>
}
