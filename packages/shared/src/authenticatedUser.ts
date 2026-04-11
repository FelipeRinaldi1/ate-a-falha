export interface AuthenticatedUser {
	id: string
	role: 'USER' | 'ADMIN'
}

export type authenticatedUser = AuthenticatedUser
