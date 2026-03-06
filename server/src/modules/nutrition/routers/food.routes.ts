import { Router } from 'express'
import { prisma } from '../../../infra/prisma.client.js'
import { FoodRepository } from '../repositories/food.repository.js'
import { FoodService } from '../services/food.service.js'
import { FoodController } from '../controllers/food.controller.js'

// 1. Instanciamos o Banco (Pode vir de um arquivo separado tbm)

// 2. Montamos a "Cadeia de Suprimentos" (Injeção de Dependência)
const repository = new FoodRepository(prisma)
const service = new FoodService(repository)
const controller = new FoodController(service)

const foodRoutes = Router()

/**
 * IMPORTANTE: O Controller espera o 'req.user.id'.
 * Para testar agora, você precisa de um middleware que coloque o ID lá.
 * Vou criar um 'mock' rápido aqui embaixo só para o teste passar.
 */
const mockAuth = (req: any, _res: any, next: any) => {
	req.user = { id: '100' } // Simula um usuário logado
	next()
}

// 3. A Rota: Escolte o dado do POST até o Controller
foodRoutes.post('/', mockAuth, (req, res, next) => controller.create(req, res, next))

export { foodRoutes }
