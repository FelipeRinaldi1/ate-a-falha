import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute, PublicRoute } from './RoutesWrapers'
import { HomePage } from '../pages/Home.page'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { Center } from '@mantine/core'

import WaterCard from '../features/nutrition/components/WaterCard'

export const router = createBrowserRouter([
	{
		path: '/sandbox',
		element: (
			<Center>
				<WaterCard />
			</Center>
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
