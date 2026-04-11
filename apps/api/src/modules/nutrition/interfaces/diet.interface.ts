import { CreateDietDTO, UpdateDietDTO } from "@ate-a-falha/shared"

import { DietFull } from "@ate-a-falha/database"

import { Result } from "@ate-a-falha/shared"


export interface IDietRepository {
	create(data: CreateDietDTO, userId: string): Promise<Result<DietFull>>

	update(id: string, data: UpdateDietDTO, userId: string): Promise<Result<DietFull>>

	delete(id: string, userId: string): Promise<Result<void>>

	findAll(userId: string): Promise<Result<DietFull[]>>

	findById(id: string, userId: string): Promise<Result<DietFull>>
}
