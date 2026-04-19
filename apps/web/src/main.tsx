import React from 'react'
import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core' // 1. Importa o provedor
import '@mantine/core/styles.css' // 2. Importa o CSS
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		{/* O Provedor DEVE envolver o App inteiro */}
		<MantineProvider>
			<App />
		</MantineProvider>
	</React.StrictMode>
)
