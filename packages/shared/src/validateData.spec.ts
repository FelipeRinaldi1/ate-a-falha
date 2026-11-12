import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { validateData } from './validateData.js'

describe('validateData', () => {
	const testSchema = z.object({
		name: z.string().min(2),
		age: z.number().int().positive(),
	})

	it('returns success with parsed data when input is valid', () => {
		const result = validateData(testSchema, { name: 'Felipe', age: 25 })

		expect(result.isSuccess()).toBe(true)
		if (result.isSuccess()) {
			expect(result.value).toEqual({ name: 'Felipe', age: 25 })
		}
	})

	it('returns failure with VALIDATION type, customMessage, and Zod details when input is invalid', () => {
		const result = validateData(testSchema, { name: 'F', age: -1 }, 'Custom validation error')

		expect(result.isFailure()).toBe(true)
		if (result.isFailure()) {
			expect(result.error.type).toBe('VALIDATION')
			expect(result.error.message).toBe('Custom validation error')
			expect(Array.isArray(result.error.details)).toBe(true)
			expect((result.error.details as unknown[]).length).toBeGreaterThanOrEqual(2)
		}
	})

	it('uses default message when customMessage is omitted', () => {
		const result = validateData(testSchema, {})

		expect(result.isFailure()).toBe(true)
		if (result.isFailure()) {
			expect(result.error.message).toBe('Validation failed')
		}
	})
})
