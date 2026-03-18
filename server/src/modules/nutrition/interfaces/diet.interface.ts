import { CreateDietDTO, UpdateDietDTO } from '../DTOs/diet.schema.js'
import { DietEntity } from '../entities/diet.entity.js'
import { Result } from '@/@utils/result.js'

export interface IDietRepository {
	create(data: CreateDietDTO, userId: string): Promise<Result<DietEntity>>

	update(id: string, data: UpdateDietDTO, userId: string): Promise<Result<DietEntity>>

	delete(id: string, userId: string): Promise<Result<void>>

	findAll(userId: string): Promise<Result<DietEntity[]>>

	findById(id: string, userId: string): Promise<Result<DietEntity>>
}
