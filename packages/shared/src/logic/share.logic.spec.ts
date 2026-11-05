import { describe, it, expect } from 'vitest'
import { ShareLogic } from './share.logic.js'

describe('ShareLogic Unit Tests', () => {
	describe('generateShareCode', () => {
		it('should generate a T-XXXXXX code for workout plans', () => {
			const code = ShareLogic.generateShareCode('workout', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890')
			expect(code).toBe('T-A1B2C3')
		})

		it('should generate a D-XXXXXX code for diets', () => {
			const code = ShareLogic.generateShareCode('diet', '9f8e7d6c-b5a4-3210-fedc-ba0987654321')
			expect(code).toBe('D-9F8E7D')
		})

		it('should throw an error if the ID is shorter than 6 characters', () => {
			expect(() => ShareLogic.generateShareCode('workout', '123')).toThrow(
				'Invalid resource ID for share code generation.'
			)
		})
	})

	describe('parseShareInput', () => {
		it('should parse a full workout share URL from QR code', () => {
			const result = ShareLogic.parseShareInput(
				'https://ateafalha.com.br/share/workout/a1b2c3d4-e5f6-4890-abcd-ef1234567890'
			)
			expect(result).toEqual({
				resourceType: 'workout',
				codeOrId: 'a1b2c3d4-e5f6-4890-abcd-ef1234567890',
			})
		})

		it('should parse a full diet share URL from QR code', () => {
			const result = ShareLogic.parseShareInput(
				'http://localhost:5173/share/diet/9f8e7d6c-b5a4-4210-fedc-ba0987654321'
			)
			expect(result).toEqual({
				resourceType: 'diet',
				codeOrId: '9f8e7d6c-b5a4-4210-fedc-ba0987654321',
			})
		})

		it('should parse workout short codes with T- or W- prefix (case-insensitive)', () => {
			expect(ShareLogic.parseShareInput('T-A1B2C3')).toEqual({
				resourceType: 'workout',
				codeOrId: 'a1b2c3',
			})
			expect(ShareLogic.parseShareInput('t-a1b2c3')).toEqual({
				resourceType: 'workout',
				codeOrId: 'a1b2c3',
			})
			expect(ShareLogic.parseShareInput('W-A1B2C3')).toEqual({
				resourceType: 'workout',
				codeOrId: 'a1b2c3',
			})
		})

		it('should parse diet short codes with D- prefix (case-insensitive)', () => {
			expect(ShareLogic.parseShareInput('D-9F8E7D')).toEqual({
				resourceType: 'diet',
				codeOrId: '9f8e7d',
			})
			expect(ShareLogic.parseShareInput('d9f8e7d')).toEqual({
				resourceType: 'diet',
				codeOrId: '9f8e7d',
			})
		})

		it('should parse a raw 6-character hex code without prefix', () => {
			expect(ShareLogic.parseShareInput('A1B2C3')).toEqual({
				resourceType: undefined,
				codeOrId: 'a1b2c3',
			})
		})

		it('should return null for empty, whitespace, or invalid inputs', () => {
			expect(ShareLogic.parseShareInput('')).toBeNull()
			expect(ShareLogic.parseShareInput('   ')).toBeNull()
			expect(ShareLogic.parseShareInput('123')).toBeNull()
			expect(ShareLogic.parseShareInput('INVALID-CODE-XYZ')).toBeNull()
		})
	})
})
