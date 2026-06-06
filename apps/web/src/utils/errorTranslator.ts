interface ApiError {
	message?: string
	response?: {
		data?: {
			message?: string
		}
	}
}

function isApiError(error: unknown): error is ApiError {
	return typeof error === 'object' && error !== null
}

export function translateError(error: unknown, defaultMsg: string): string {
	if (!error) return defaultMsg

	if (!isApiError(error)) return defaultMsg

	if ((error as { message?: string }).message === 'Network Error') {
		return 'Erro de conexão com o servidor. Verifique sua conexão ou tente novamente mais tarde.'
	}

	const serverMessage = error.response?.data?.message

	if (!serverMessage) {
		return defaultMsg
	}

	const translations: Record<string, string> = {
		'Invalid credentials.': 'E-mail ou senha incorretos.',
		'Invalid credentials': 'E-mail ou senha incorretos.',
		'Email already exists': 'Este e-mail já está cadastrado.',
		'User not found': 'Usuário não encontrado.',
		'Password is incorrect': 'A senha informada está incorreta.',
		'Invalid user data': 'Dados de usuário inválidos.',
		'Invalid update data': 'Dados de atualização inválidos.',
		'Nenhum registro para excluir': 'Nenhum registro para excluir.',
	}

	if (translations[serverMessage]) {
		return translations[serverMessage]
	}

	const lower = serverMessage.toLowerCase()
	if (lower.includes('already exists') || lower.includes('unique constraint')) {
		return 'Este registro já está cadastrado.'
	}

	return serverMessage
}
