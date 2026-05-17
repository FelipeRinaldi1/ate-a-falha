import { useEffect, useState, type ReactNode } from 'react'
import { api } from '../api/axiosInstance'
import type { UserResponseDTO } from '@ate-a-falha/shared'
import { AuthContext } from '../features/user/hooks/useAuth'

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserResponseDTO | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		api.get('/user/me')
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
			await api.post('/user/logout')
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
