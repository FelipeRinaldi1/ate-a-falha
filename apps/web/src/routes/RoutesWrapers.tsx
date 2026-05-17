import { Navigate } from 'react-router-dom'
import { useAuth } from '../features/user/hooks/useAuth'

// Redirect to login if not authenticated
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth()
	if (isLoading) return <div>Loading...</div>
	if (!isAuthenticated) return <Navigate to="/login" replace />
	return <>{children}</>
}

// Redirect to home if authenticated
export function PublicRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth()
	if (isLoading) return <div>Loading...</div>
	if (isAuthenticated) return <Navigate to="/" replace />
	return <>{children}</>
}
// If the rout doesnt need authentication, do not use public neither protect wrapper
