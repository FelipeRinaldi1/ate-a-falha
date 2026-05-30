import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute, PublicRoute } from './RoutesWrapers'
import { HomePage } from '../pages/Home.page'
import { LoginPage } from '../features/user/pages/Login.page'
import { RegisterPage } from '../features/user/pages/Register.page'
import { BodyMetricRegisterPage } from '../features/bodyMetric/pages/SetupMetrics.page'
import { ProfilePage } from '../features/user/pages/Profile.page'
import { EditMetricsPage } from '../features/bodyMetric/pages/EditMetrics.page'
import { NewMetricPage } from '../features/bodyMetric/pages/NewMetric.page'
import { MetricsEvolutionPage } from '../features/bodyMetric/pages/MetricsEvolution.page'

export const router = createBrowserRouter([
	{
		path: '/sandbox',
		element: <ProtectedRoute>a</ProtectedRoute>,
	},
	{
		path: '/profile',
		element: (
			<ProtectedRoute>
				<ProfilePage></ProfilePage>
			</ProtectedRoute>
		),
	},
	{
		path: '/profile/edit-metrics',
		element: (
			<ProtectedRoute>
				<EditMetricsPage></EditMetricsPage>
			</ProtectedRoute>
		),
	},
	{
		path: '/profile/new-metric',
		element: (
			<ProtectedRoute>
				<NewMetricPage></NewMetricPage>
			</ProtectedRoute>
		),
	},
	{
		path: '/profile/evolution',
		element: (
			<ProtectedRoute>
				<MetricsEvolutionPage></MetricsEvolutionPage>
			</ProtectedRoute>
		),
	},
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
		path: '/setup-metrics',
		element: (
			<ProtectedRoute>
				<BodyMetricRegisterPage />
			</ProtectedRoute>
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
