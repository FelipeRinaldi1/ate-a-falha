import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute, PublicRoute } from './RoutesWrapers'
import { HomePage } from '../pages/Home.page'
import { LoginPage } from '../pages/Login.page'
import { RegisterPage } from '../pages/Register.page'
import { BodyMetricRegisterPage } from '../pages/SetupMetrics.page'
import { ProfilePage } from '../pages/Profile.page'
import { EditMetricsPage } from '../pages/EditMetrics.page'
import { NewMetricPage } from '../pages/NewMetric.page'
import { MetricsEvolutionPage } from '../pages/MetricsEvolution.page'

export const router = createBrowserRouter([
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
