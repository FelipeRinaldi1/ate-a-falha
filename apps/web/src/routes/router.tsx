import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute, PublicRoute } from './RoutesWrapers'
import { HomePage } from '../pages/Home.page'
import { LoginPage } from '../pages/Login.page'
import { RegisterPage } from '../pages/Register.page'
import { BodyMetricRegisterPage } from '../pages/SetupMetrics.page'

export const router = createBrowserRouter([
	{
		path: '/sandbox',
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
