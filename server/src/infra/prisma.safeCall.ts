import { Prisma } from '../generated/prisma/client.js'
import { Result, failure, success } from '../utils/result.js'

export async function safeCall<T>(promise: Promise<T>): Promise<Result<T>> {
	try {
		const data = await promise
		return success(data)
	} catch (error: unknown) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			switch (error.code) {
				case 'P2002':
					return failure({ type: 'CONFLICT', message: 'Duplicated Register.' })
				case 'P2003':
					return failure({
						type: 'CONFLICT',
						message:
							'Foreign key constraint failed. A related record is required or still exists.',
					})
				case 'P2025':
					return failure({ type: 'NOT_FOUND', message: 'Register not found.' })
			}
		}

		return failure({
			type: 'DATABASE_ERROR',
			message: error instanceof Error ? error.message : 'Error in Database.',
		})
	}
}
