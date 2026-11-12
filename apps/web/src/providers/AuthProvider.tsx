import { useEffect, useState, type ReactNode } from 'react'
import { api, setUnauthorizedHandler } from '../api/axiosInstance'
import type { UserResponseDTO } from '@ate-a-falha/shared'
import { AuthContext } from '../features/user/hooks/useAuth'
import { queryClient } from './queryClient'

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserResponseDTO | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		setUnauthorizedHandler(() => {
			queryClient.clear()
			setUser(null)
		})

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

		return () => {
			setUnauthorizedHandler(null)
		}
	}, [])

	const login = (loggedUser: UserResponseDTO) => {
		queryClient.clear()
		setUser(loggedUser)
	}

	const logout = async () => {
		try {
			await api.post('/users/logout')
		} catch (error) {
			console.error('Failed to logout in backend', error)
		} finally {
			queryClient.clear()
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
