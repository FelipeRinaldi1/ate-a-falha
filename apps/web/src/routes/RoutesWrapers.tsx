import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../features/user/hooks/useAuth'

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
export function PublicRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth()
	const location = useLocation()
	
	if (isLoading) return <div>Loading...</div>
	
	if (isAuthenticated) {
		const searchParams = new URLSearchParams(location.search)
		const redirect = searchParams.get('redirect')
		return <Navigate to={redirect || "/workout"} replace />
	}
	
	return <>{children}</>
}
