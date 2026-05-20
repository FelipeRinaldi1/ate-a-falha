import { describe, test, expect } from 'vitest'
import { BodyMetricLogic } from './bodyMetric.logic.js'

describe('Body Metric Logic tests', () => {
	describe('BMI tests', () => {
		test('Should calculate BMI correctly', () => {
			const result = BodyMetricLogic.calculateBMI(70, 1.75)
			expect(result).toBe(22.9)
		})
		test('Should not divide by zero', () => {
			const result = BodyMetricLogic.calculateBMI(70, 0)
			expect(result).toBe(0)
		})
		test('Should not multiply by zero', () => {
			const result = BodyMetricLogic.calculateBMI(0, 1.75)
			expect(result).toBe(0)
		})
	})
	describe('BMR tests', () => {
		test('Should calculate Male BMR correctly', () => {
			const result = BodyMetricLogic.calculateBMR('MALE', 70, 175, 25)
			expect(result).toBe(1674)
		})
		test('Should calculate Female BMR correctly', () => {
			const result = BodyMetricLogic.calculateBMR('FEMALE', 70, 175, 25)
			expect(result).toBe(1508)
		})
		test('Should not divide by zero or negative weight', () => {
			const result = BodyMetricLogic.calculateBMR('MALE', 70, 0, 25)
			expect(result).toBe(0)
		})
		test('Should not multiply by zero or negative height', () => {
			const result = BodyMetricLogic.calculateBMR('MALE', 0, 175, 25)
			expect(result).toBe(0)
		})
		test('Should not multiply by zero or negative age', () => {
			const result = BodyMetricLogic.calculateBMR('MALE', 70, 175, 0)
			expect(result).toBe(0)
		})
	})
	describe('TDEE tests', () => {
		test('Should calculate TDEE correctly (level 0 activty)', () => {
			const result = BodyMetricLogic.calculateTDEE(1674, 0)
			expect(result).toBe(2009)
		})
		test('Should calculate TDEE correctly (level 1 activty)', () => {
			const result = BodyMetricLogic.calculateTDEE(1674, 1)
			expect(result).toBe(2302)
		})
		test('Should calculate TDEE correctly (level 2 activty)', () => {
			const result = BodyMetricLogic.calculateTDEE(1674, 2)
			expect(result).toBe(2595)
		})
		test('Should calculate TDEE correctly (level 3 activty)', () => {
			const result = BodyMetricLogic.calculateTDEE(1674, 3)
			expect(result).toBe(2888)
		})
		test('Should calculate TDEE correctly (level 3 activty)', () => {
			const result = BodyMetricLogic.calculateTDEE(1674, 4)
			expect(result).toBe(3181)
		})
		test('Should return 1.2 (activty 2) as Default', () => {
			const result = BodyMetricLogic.calculateTDEE(1674, 5)
			expect(result).toBe(2009)
		})
		test('Should not calculate with negative activity level', () => {
			const result = BodyMetricLogic.calculateTDEE(1674, -1)
			expect(result).toBe(2009)
		})
		test('Should not calculate with negative BMR', () => {
			const result = BodyMetricLogic.calculateTDEE(-1674, 0)
			expect(result).toBe(0)
		})
	})
})
