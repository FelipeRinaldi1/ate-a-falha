interface ErrorDetail {
	message?: string
	path?: Array<string | number>
}

interface ApiError {
	message?: string
	response?: {
		data?: {
			message?: string
			details?: ErrorDetail[]
		}
	}
}

function isApiError(error: unknown): error is ApiError {
	return typeof error === 'object' && error !== null
}

const TRANSLATIONS: Record<string, string> = {
	'Invalid credentials.': 'E-mail ou senha incorretos.',
	'Invalid credentials': 'E-mail ou senha incorretos.',
	'Email already exists': 'Este e-mail já está cadastrado.',
	'Duplicated Register.': 'Este registro já está cadastrado.',
	'Register not found.': 'Registro não encontrado.',
	'Not found or not authorized': 'Recurso não encontrado ou sem permissão.',
	'User not found': 'Usuário não encontrado.',
	'Password is incorrect': 'A senha informada está incorreta.',
	'Invalid user data': 'Dados de usuário inválidos.',
	'Invalid update data': 'Dados de atualização inválidos.',
	'Token missing': 'Sessão expirada. Faça login novamente.',
	'Invalid token': 'Sessão inválida. Faça login novamente.',
	'You must complete onboarding before performing this action': 'Complete seu perfil antes de continuar.',
	'Nenhum registro para excluir': 'Nenhum registro para excluir.',
}

export function translateError(error: unknown, defaultMsg: string): string {
	if (!error || !isApiError(error)) return defaultMsg

	if (error.message === 'Network Error') {
		return 'Erro de conexão com o servidor. Verifique sua conexão ou tente novamente mais tarde.'
	}

	const responseData = error.response?.data
	if (Array.isArray(responseData?.details) && responseData.details.length > 0) {
		const detailMessages = responseData.details
			.map((d) => {
				if (!d.message) return null
				const translated = TRANSLATIONS[d.message] || d.message
				const field = d.path?.length ? d.path.join('.') : ''
				return field ? `${field}: ${translated}` : translated
			})
			.filter((msg): msg is string => Boolean(msg))

		if (detailMessages.length > 0) {
			return detailMessages.join('; ')
		}
	}

	const serverMessage = responseData?.message
	if (!serverMessage) {
		if (error instanceof Error && error.message && !error.message.startsWith('Request failed with status code')) {
			return TRANSLATIONS[error.message] || error.message
		}
		return defaultMsg
	}

	if (TRANSLATIONS[serverMessage]) {
		return TRANSLATIONS[serverMessage]
	}

	const lower = serverMessage.toLowerCase()
	if (lower.includes('already exists') || lower.includes('unique constraint') || lower.includes('duplicated')) {
		return 'Este registro já está cadastrado.'
	}

	return serverMessage
}
