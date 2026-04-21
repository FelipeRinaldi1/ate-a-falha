import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuth } from './providers/AuthProvider'

import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

// Redirect to login if not authenticated
function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth()
	if (isLoading) return <div>Loading...</div>
	if (!isAuthenticated) return <Navigate to="/login" replace />
	return <>{children}</>
}

// Redirect to home if authenticated
function PublicRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth()
	if (isLoading) return <div>Loading...</div>
	if (isAuthenticated) return <Navigate to="/" replace />
	return <>{children}</>
}

// If the rout doesnt need authentication, do not use public neither protect wrapper

export const router = createBrowserRouter([
	{
		path: '/login',
		element: (
			<PublicRoute>
				<LoginPage />
			</PublicRoute>
		),
	},
	{
		path: '/register',
		element: (
			<PublicRoute>
				<RegisterPage />
			</PublicRoute>
		),
	},
	{
		path: '/',
		element: (
			<ProtectedRoute>
				<HomePage />
			</ProtectedRoute>
		),
	},

	{
		path: '*',
		element: <Navigate to="/login" replace />,
	},
])
