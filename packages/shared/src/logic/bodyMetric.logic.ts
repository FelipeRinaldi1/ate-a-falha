export class BodyMetricLogic {
	static calculateBMI(weight: number, height: number): number {
		if (height <= 0) {
			return 0
		}
		if (weight <= 0) {
			return 0
		}
		const result = weight / (height * height)
		return Math.round(result * 10) / 10
	}

	static calculateBMR(gender: 'MALE' | 'FEMALE', weight: number, height: number, age: number): number {
		if (age <= 0) {
			return 0
		}
		if (height <= 0) {
			return 0
		}
		if (weight <= 0) {
			return 0
		}
		if (gender === 'MALE') {
			const result = 10 * weight + 6.25 * height - 5 * age + 5
			return Math.round(result)
		}
		if (gender === 'FEMALE') {
			const result = 10 * weight + 6.25 * height - 5 * age - 161
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
