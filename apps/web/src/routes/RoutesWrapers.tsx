import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../features/user/hooks/useAuth'

// Redirect to login if not authenticated
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { user, isAuthenticated, isLoading } = useAuth()
	const location = useLocation()
	if (isLoading) return <div>Loading...</div>
	if (!isAuthenticated) {
		const redirectPath = encodeURIComponent(location.pathname + location.search)
		return <Navigate to={`/login?redirect=${redirectPath}`} replace />
	}
	if (user?.hasBodyMetrics != true && location.pathname !== '/setup-metrics') {
		return <Navigate to="/setup-metrics" replace />
	} else {
		return <>{children}</>
	}
}
// Redirect to home or redirect parameter if authenticated
export function PublicRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth()
	const location = useLocation()
	
	if (isLoading) return <div>Loading...</div>
	
	if (isAuthenticated) {
		const searchParams = new URLSearchParams(location.search)
		const redirect = searchParams.get('redirect')
		return <Navigate to={redirect || "/"} replace />
	}
	
	return <>{children}</>
}
// If the route doesnt need authentication, do not use public neither protect wrapper
