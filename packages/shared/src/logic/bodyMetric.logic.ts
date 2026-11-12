export class BodyMetricLogic {
	static calculateBMI(weight: number, height: number): number {
		if (height <= 0 || weight <= 0) {
			return 0
		}
		const heightInMeters = height > 3 ? height / 100 : height
		const result = weight / (heightInMeters * heightInMeters)
		return Math.round(result * 10) / 10
	}

	static calculateBMR(gender: 'MALE' | 'FEMALE' | 'OTHER', weight: number, height: number, age: number): number {
		if (age <= 0 || height <= 0 || weight <= 0) {
			return 0
		}
		const heightInCm = height <= 3 ? height * 100 : height
		if (gender === 'MALE') {
			const result = 10 * weight + 6.25 * heightInCm - 5 * age + 5
			return Math.round(result)
		}
		if (gender === 'FEMALE') {
			const result = 10 * weight + 6.25 * heightInCm - 5 * age - 161
			return Math.round(result)
		}
		if (gender === 'OTHER') {
			const result = 10 * weight + 6.25 * heightInCm - 5 * age - 78
			return Math.round(result)
		}
		return 0
	}

	static calculateTDEE(bmr: number, activityLevel: number): number {
		if (bmr <= 0) {
			return 0
		}
		const levels = [1.2, 1.375, 1.55, 1.725, 1.9]

		const multiplier = levels[activityLevel] ?? 1.2

		const result = bmr * multiplier

		return Math.round(result)
	}
}
