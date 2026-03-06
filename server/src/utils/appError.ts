export interface AppError {
	type: 'CONFLICT' | 'NOT_FOUND' | 'DATABASE_ERROR' | 'VALIDATION' | 'UNAUTHORIZED'
	message: string
	details?: unknown
}
