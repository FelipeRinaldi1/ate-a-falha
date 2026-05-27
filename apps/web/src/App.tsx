import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/charts/styles.css'

export function App() {
	return <RouterProvider router={router} />
}
