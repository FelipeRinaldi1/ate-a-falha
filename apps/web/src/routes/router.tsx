import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute, PublicRoute } from './RoutesWrapers'
import { WorkoutDashboardPage } from '../features/workout/pages/WorkoutDashboard.page'
import { ExerciseSearchPage } from '../features/workout/pages/ExerciseSearch.page'
import { ExerciseDetailsPage } from '../features/workout/pages/ExerciseDetails.page'
import { WorkoutPlansPage } from '../features/workout/pages/WorkoutPlans.page'
import { EditPlanPage } from '../features/workout/pages/EditPlan.page'
import { SelectActiveWorkoutPage } from '../features/workout/pages/SelectActiveWorkout.page'
import { ActiveWorkoutPage } from '../features/workout/pages/ActiveWorkout.page'
import { LoginPage } from '../features/user/pages/Login.page'
import { RegisterPage } from '../features/user/pages/Register.page'
import { BodyMetricRegisterPage } from '../features/user/bodyMetric/pages/SetupMetrics.page'
import { ProfilePage } from '../features/user/pages/Profile.page'
import { EditMetricsPage } from '../features/user/bodyMetric/pages/EditMetrics.page'
import { NewMetricPage } from '../features/user/bodyMetric/pages/NewMetric.page'
import { MetricsEvolutionPage } from '../features/user/bodyMetric/pages/MetricsEvolution.page'
import { CreateFoodPage } from '../features/nutrition/pages/CreateFood.page'
import { DietLogPage } from '../features/nutrition/pages/DietLog.page'
import { DietGoalsPage } from '../features/nutrition/pages/DietGoals.page'
import { MealDetailsPage } from '../features/nutrition/pages/MealDetails.page'
import { FoodSearchPage } from '../features/nutrition/pages/FoodSearch.page'
import { FoodDetailsPage } from '../features/nutrition/pages/FoodDetails.page'

export const router = createBrowserRouter([
	{
		path: '/workout',
		element: (
			<ProtectedRoute>
				<WorkoutDashboardPage />
			</ProtectedRoute>
		),
	},
	{
		path: '/workout/plans',
		element: (
			<ProtectedRoute>
				<WorkoutPlansPage />
			</ProtectedRoute>
		),
	},
	{
		path: '/workout/plans/:id/edit',
		element: (
			<ProtectedRoute>
				<EditPlanPage />
			</ProtectedRoute>
		),
	},
	{
		path: '/workout/active/:id/select',
		element: (
			<ProtectedRoute>
				<SelectActiveWorkoutPage />
			</ProtectedRoute>
		),
	},
	{
		path: '/workout/active/:id',
		element: (
			<ProtectedRoute>
				<ActiveWorkoutPage />
			</ProtectedRoute>
		),
	},
	{
		path: '/workout/exercises',
		element: (
			<ProtectedRoute>
				<ExerciseSearchPage />
			</ProtectedRoute>
		),
	},
	{
		path: '/workout/exercises/:id',
		element: (
			<ProtectedRoute>
				<ExerciseDetailsPage />
			</ProtectedRoute>
		),
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
		path: '/nutrition/goals',
		element: (
			<ProtectedRoute>
				<DietGoalsPage />
			</ProtectedRoute>
		),
	},
	{
		path: '/nutrition/create-food',
		element: (
			<ProtectedRoute>
				<CreateFoodPage />
			</ProtectedRoute>
		),
	},
	{
		path: '/nutrition/search',
		element: (
			<ProtectedRoute>
				<FoodSearchPage />
			</ProtectedRoute>
		),
	},
	{
		path: '/nutrition/food-catalog/:id',
		element: (
			<ProtectedRoute>
				<FoodDetailsPage />
			</ProtectedRoute>
		),
	},
	{
		path: '/nutrition/meals/:id',
		element: (
			<ProtectedRoute>
				<MealDetailsPage />
			</ProtectedRoute>
		),
	},
	{
		path: '/nutrition',
		element: (
			<ProtectedRoute>
				<DietLogPage />
			</ProtectedRoute>
		),
	},
	{
		path: '/',
		element: <Navigate to="/workout" replace />,
	},

	{
		path: '*',
		element: <Navigate to="/login" replace />,
	},
])
