import { useUsers } from './hooks/useUsers'
import './App.css'

function App() {
	// 1. Puxa os dados, o estado de carregamento e o erro do seu hook profissional
	const { data: users, isLoading, error } = useUsers()

	return (
		<div className="App">
			<h1>🚀 Ate a Falha - Sistema de Gestão</h1>

			<div className="card">
				<h2>Lista de Usuários (Vindo da API Docker)</h2>

				{/* 2. Trata o estado de carregamento */}
				{isLoading && <p>Carregando usuários do servidor...</p>}

				{/* 3. Trata erros amigavelmente */}
				{error && <p style={{ color: 'red' }}>Erro ao buscar dados: {error.message}</p>}

				{/* 4. Renderiza a lista de usuários quando os dados chegam */}
				<ul style={{ textAlign: 'left' }}>
					{users?.map((user: any) => (
						<li key={user.id}>
							<strong>{user.name}</strong> - {user.email}
						</li>
					))}
				</ul>

				{/* 5. Mostra uma mensagem se a lista estiver vazia */}
				{!isLoading && users?.length === 0 && <p>Nenhum usuário cadastrado no banco.</p>}
			</div>
		</div>
	)
}

export default App
