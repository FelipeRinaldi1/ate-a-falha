import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../features/user/hooks/useAuth'

// Redirect to login if not authenticated
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { user, isAuthenticated, isLoading } = useAuth()
	const location = useLocation()
	if (isLoading) return <div>Loading...</div>
	if (!isAuthenticated) return <Navigate to="/login" replace />
	if (user?.hasBodyMetrics != true && location.pathname !== '/setup-metrics') {
		return <Navigate to="/setup-metrics" replace />
	} else {
		return <>{children}</>
	}
}
// Redirect to home if authenticated
export function PublicRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth()
	if (isLoading) return <div>Loading...</div>
	if (isAuthenticated) return <Navigate to="/" replace />
	return <>{children}</>
}
// If the route doesnt need authentication, do not use public neither protect wrapper
