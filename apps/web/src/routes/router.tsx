import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute, PublicRoute } from './RoutesWrapers'
import { HomePage } from '../pages/Home.page'
import { LoginPage } from '../pages/Login.page'
import { RegisterPage } from '../pages/Register.page'
import { BodyMetricRegisterPage } from '../pages/BodyMetricRegister.page'

export const router = createBrowserRouter([
	{
		path: '/sandbox',
		element: <BodyMetricRegisterPage />,
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
