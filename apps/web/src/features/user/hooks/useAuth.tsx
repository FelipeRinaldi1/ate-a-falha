import { createContext, useContext } from 'react'
import type { UserResponseDTO } from '@ate-a-falha/shared'

export interface AuthContextData {
	user: UserResponseDTO | null
	isAuthenticated: boolean
	isLoading: boolean
	login: (user: UserResponseDTO) => void
	logout: () => Promise<void>
	refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function useAuth() {
	return useContext(AuthContext)
}
