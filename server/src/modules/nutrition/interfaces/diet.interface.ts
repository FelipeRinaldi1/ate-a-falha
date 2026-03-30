import { CreateDietDTO, UpdateDietDTO } from '../schema/diet.schema.js'
import { DietFull } from '../schema/diet.schema.js'
import { Result } from '@/@utils/result.js'

export interface IDietRepository {
	create(data: CreateDietDTO, userId: string): Promise<Result<DietFull>>

	update(id: string, data: UpdateDietDTO, userId: string): Promise<Result<DietFull>>

	delete(id: string, userId: string): Promise<Result<void>>

	findAll(userId: string): Promise<Result<DietFull[]>>

	findById(id: string, userId: string): Promise<Result<DietFull>>
}
