export interface AppError {
	type: 'CONFLICT' | 'NOT_FOUND' | 'DATABASE_ERROR' | 'VALIDATION' | 'UNAUTHORIZED' | 'FORBIDDEN'
	message: string
	details?: unknown
}
