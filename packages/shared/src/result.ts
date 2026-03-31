import { AppError } from './appError.js'

export class Success<T, E> {
	readonly value: T
	constructor(value: T) {
		this.value = value
	}
	isSuccess(): this is Success<T, E> {
		return true
	}
	isFailure(): this is Failure<T, E> {
		return false
	}
}

export class Failure<T, E> {
	readonly error: E
	constructor(error: E) {
		this.error = error
	}
	isSuccess(): this is Success<T, E> {
		return false
	}
	isFailure(): this is Failure<T, E> {
		return true
	}
}

export type Result<T, E = AppError> = Success<T, E> | Failure<T, E>

export const success = <T, E>(value: T): Result<T, E> => new Success(value)
export const failure = <T, E>(error: E): Result<T, E> => new Failure(error)

export const Result = {
	combine: <T, E>(results: Result<T, E>[]): Result<T[], E> => {
		const values: T[] = []

		for (const result of results) {
			if (result.isFailure()) {
				return failure(result.error)
			}
			values.push(result.value)
		}

		return success(values)
	},
}
