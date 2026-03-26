export interface user {
	id: string
	role: 'USER' | 'ADMIN'
	name: string
	birthDate: Date
	gender: 'MALE' | 'FEMALE'
	createdAt: Date
	updatedAt: Date
}
