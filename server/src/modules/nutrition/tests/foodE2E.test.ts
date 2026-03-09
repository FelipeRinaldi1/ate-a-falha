import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FoodController } from '../controllers/food.controller.js' 
import { createFoodDTO, updateFoodDTO, foodSearchDTO } from '../DTOs/food.schema.js'
import { success } from '@/@utils/result.js' 
import { HTTP_STATUS } from '@/@constants/global/httpCodesConstants.js'

describe('FoodController - Unit Tests (CRUD com Roles)', () => {
    let mockService: any
    let controller: FoodController
    let req: any
    let res: any
    let next: any

    const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000'
    const MOCK_USER = { id: 'user-123', role: 'USER' }

    beforeEach(() => {
        mockService = {
            create: vi.fn(),
            findById: vi.fn(),
            findAll: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        }
        controller = new FoodController(mockService)
        
        // Mock do Express com o User devidamente preenchido
        req = { 
            params: {}, 
            body: {},
            user: MOCK_USER // Essencial para o Controller não crashar
        }
        res = { 
            status: vi.fn().mockReturnThis(), 
            json: vi.fn().mockReturnThis() 
        }
        next = vi.fn().mockImplementation((err) => {
            console.log('   ↳ [ERR] Next chamado com:', err.type, '-', err.message)
        })

        console.log('\n--- 🧪 Executando Cenário ---')
    })

    // --- TESTE DE CRIAÇÃO ---
    it('deve criar um alimento usando os novos tipos do DTO (unidade "serving")', async () => {
        console.log('[TESTE] Cenário: CREATE (User comum)')
        const foodData: createFoodDTO = {
            name: 'Pão Integral',
            baseUnit: 'serving', // Testando o novo enum
            baseAmount: 1,
            calories: 70,
            carbohydrate: 15,
            protein: 3,
            fat: 1,
            fiber: 2 // Opcional/Nullable agora
        }
        req.body = foodData

        mockService.create.mockResolvedValue(success({ id: VALID_UUID, ...foodData }))

        await controller.create(req, res, next)

        console.log('   ↳ Validando chamada do Service com o objeto User')
        expect(mockService.create).toHaveBeenCalledWith(foodData, MOCK_USER)
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED)
        console.log('   ✅ Sucesso: 201 Created')
    })

    // --- TESTE DE BUSCA (FIND ALL) ---
    it('deve buscar alimentos com paginação e filtros (findAll)', async () => {
        console.log('[TESTE] Cenário: FIND ALL')
        const searchParams: foodSearchDTO = {
            name: 'Pato',
            take: 20
        }
        req.body = searchParams

        mockService.findAll.mockResolvedValue(success([]))

        await controller.findAll(req, res, next)

        console.log('   ↳ Validando filtros de busca:', searchParams)
        expect(mockService.findAll).toHaveBeenCalledWith(expect.objectContaining({ take: 20 }), MOCK_USER)
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
        console.log('   ✅ Sucesso: Lista retornada.')
    })

    // --- TESTE DE LEITURA POR ID ---
    it('deve buscar um alimento por UUID passando o authUser', async () => {
        console.log('[TESTE] Cenário: FIND BY ID')
        req.params.id = VALID_UUID
        
        mockService.findById.mockResolvedValue(success({ id: VALID_UUID, name: 'Banana' }))

        await controller.findById(req, res, next)

        expect(mockService.findById).toHaveBeenCalledWith(VALID_UUID, MOCK_USER)
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
        console.log('   ✅ Sucesso: Alimento e permissão validados.')
    })

    // --- TESTE DE ATUALIZAÇÃO ---
    it('deve atualizar dados parciais respeitando o novo schema', async () => {
        console.log('[TESTE] Cenário: UPDATE')
        req.params.id = VALID_UUID
        const updateData: updateFoodDTO = { fiber: null } // Testando null no fiber
        req.body = updateData
        
        mockService.update.mockResolvedValue(success({ id: VALID_UUID, ...updateData }))

        await controller.update(req, res, next)

        console.log('   ↳ Enviando atualização de fibra para null')
        expect(mockService.update).toHaveBeenCalledWith(VALID_UUID, updateData, MOCK_USER)
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
        console.log('   ✅ Sucesso: Registro atualizado.')
    })

    // --- TESTE DE DELEÇÃO ---
    it('deve deletar um alimento passando o authUser', async () => {
        console.log('[TESTE] Cenário: DELETE')
        req.params.id = VALID_UUID

        mockService.delete.mockResolvedValue(success(undefined))

        await controller.delete(req, res, next)

        expect(mockService.delete).toHaveBeenCalledWith(VALID_UUID, MOCK_USER)
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
        console.log('   ✅ Sucesso: Deleção autorizada.')
    })

    // --- TESTE DE VALIDAÇÃO DE INPUT ---
    it('deve falhar se baseAmount for zero ou negativo (Zod)', async () => {
        console.log('[TESTE] Cenário: VALIDAÇÃO ZOD (baseAmount <= 0)')
        req.body = { 
            name: 'Erro', 
            baseUnit: 'g', 
            baseAmount: -10, // Inválido (positive())
            calories: 10,
            carbohydrate: 1,
            protein: 1,
            fat: 1
        }

        await controller.create(req, res, next)

        expect(next).toHaveBeenCalled()
        expect(mockService.create).not.toHaveBeenCalled()
        console.log('   ✅ Sucesso: Zod barrou baseAmount negativo.')
    })
})