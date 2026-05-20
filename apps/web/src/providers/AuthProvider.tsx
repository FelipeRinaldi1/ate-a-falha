import { useEffect, useState, type ReactNode } from 'react'
import { api } from '../api/axiosInstance'
import type { UserResponseDTO } from '@ate-a-falha/shared'
import { AuthContext } from '../features/user/hooks/useAuth'

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

	const refreshUser = async () => {
		try {
			const response = await api.get('/users/me')
			setUser(response.data)
		} catch (error) {
			console.log('Failed to refresh user:', error)
		}
	}

	return (
		<AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, refreshUser }}>
			{children}
		</AuthContext.Provider>
	)
}
