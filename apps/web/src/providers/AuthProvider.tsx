import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../api/instance'
import type { UserResponseDTO } from '@ate-a-falha/shared'

interface AuthContextData {
	user: UserResponseDTO | null
	isAuthenticated: boolean
	isLoading: boolean
	login: (user: UserResponseDTO) => void
	logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserResponseDTO | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		api.get('/users/me')
			.then((response) => {
				setUser(response.data)
			})
			.catch(() => {
				setUser(null)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [])

	const login = (loggedUser: UserResponseDTO) => {
		setUser(loggedUser)
	}

	const logout = async () => {
		try {
			await api.post('/users/logout')
		} catch (error) {
			console.error('Failed to logout in backend', error)
		} finally {
			setUser(null)
		}
	}

	return (
		<AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	return useContext(AuthContext)
}
