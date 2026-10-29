import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Hook que retorna uma função de navegação reversa segura (`goBack`).
 * Se houver histórico interno na aba atual (`window.history.state.idx > 0`),
 * desempilha a entrada anterior com `navigate(-1)` para manter sincronia com
 * o botão Voltar do navegador. Caso contrário, redireciona para `fallbackPath`
 * usando `{ replace: true }`.
 */
export function useGoBack(defaultFallback: string = '/workout') {
	const navigate = useNavigate()

	return useCallback(
		(fallbackPath: string = defaultFallback) => {
			const historyIdx = window.history.state?.idx
			if (typeof historyIdx === 'number' && historyIdx > 0) {
				navigate(-1)
			} else {
				navigate(fallbackPath, { replace: true })
			}
		},
		[navigate, defaultFallback]
	)
}
