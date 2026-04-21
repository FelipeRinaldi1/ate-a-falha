import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'

export function App() {
	return <RouterProvider router={router} />
}
