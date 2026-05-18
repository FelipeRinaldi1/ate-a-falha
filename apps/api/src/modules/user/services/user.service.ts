import bcrypt from 'bcryptjs'
import jwt, { type SignOptions } from 'jsonwebtoken'

import {
	type CreateUserWithAuthDTO,
	type UpdateUserDTO,
	type LoginDTO,
	type ChangePasswordDTO,
	type ChangeEmailDTO,
	type UserResponseDTO,
	type InternalAuthResponse,
	success,
	failure,
	type Result,
} from '@ate-a-falha/shared'
import { type UserFull, type AuthFull } from '@ate-a-falha/database'
import type { IUserRepository } from '../interfaces/user.interfaces.js'
import type { IAuthRepository } from '../interfaces/auth.interfaces.js'
import { ENV } from '../../../config/env.js'
import { logger } from '../../../config/logger.js'
import { BodyMetricService } from './bodyMetric.service.js'

const BCRYPT_ROUNDS = 10

export class UserService {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly authRepository: IAuthRepository,
		private readonly bodyMetricService: BodyMetricService
	) {}

	// Private helpers ────────────────────────────────────────────────────────

	private async hashPassword(plain: string): Promise<string> {
		return bcrypt.hash(plain, BCRYPT_ROUNDS)
	}

	private async verifyPassword(plain: string, hash: string): Promise<boolean> {
		return bcrypt.compare(plain, hash)
	}

	private generateToken(userId: string, email: string): string {
		return jwt.sign({ id: userId, email }, ENV.JWT_SECRET, {
			subject: userId,
			expiresIn: ENV.JWT_EXPIRES_IN,
		} as SignOptions)
	}

	private async findAuthOrFail(userId: string): Promise<Result<AuthFull>> {
		const result = await this.authRepository.findById(userId)
		if (result.isFailure()) return failure({ type: 'NOT_FOUND', message: 'Auth record not found.' })
		return result
	}

	private toResponse(user: UserFull, hasBodyMetrics: boolean): Result<UserResponseDTO> {
		if (!user.auth) return failure({ type: 'NOT_FOUND', message: 'Auth record not found.' })

		return success({
			id: user.id,
			name: user.name,
			role: user.role,
			gender: user.gender,
			birthDate: user.birthDate,
			email: user.auth.email,
			hasBodyMetrics,
		})
	}

	// User CRUD ───────────────────────────────────────────────────────────────

	async getMe(id: string): Promise<Result<UserResponseDTO>> {
		const result = await this.userRepository.findById(id)
		if (result.isFailure()) return failure(result.error)

		const hasBodyMetrics = await this.bodyMetricService.hasBodyMetrics(id)
		return this.toResponse(result.value, hasBodyMetrics)
	}

	async updateMe(id: string, data: UpdateUserDTO): Promise<Result<UserResponseDTO>> {
		const { auth, ...userData } = data

		const userResult = await this.userRepository.update(id, userData)
		if (userResult.isFailure()) return failure(userResult.error)

		const hasBodyMetrics = await this.bodyMetricService.hasBodyMetrics(id)

		if (!auth) return this.toResponse(userResult.value, hasBodyMetrics)

		const authResult = await this.authRepository.updateEmail(id, auth.email!)
		if (authResult.isFailure()) return failure(authResult.error)

		return this.toResponse({ ...userResult.value, auth: authResult.value }, hasBodyMetrics)
	}

	async deleteMe(id: string): Promise<Result<void>> {
		const result = await this.userRepository.delete(id)
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}

	// Auth operations ─────────────────────────────────────────────────────────

	async login(data: LoginDTO): Promise<Result<InternalAuthResponse>> {
		logger.info({ email: data.email }, 'Attempting login')

		const authResult = await this.authRepository.findByEmail(data.email)
		if (authResult.isFailure()) {
			logger.warn({ email: data.email }, 'Login failed: user not found')
			return failure({ type: 'NOT_FOUND', message: 'Invalid credentials.' })
		}

		const auth = authResult.value
		const isValidPassword = await this.verifyPassword(data.password, auth.password)
		if (!isValidPassword) {
			logger.warn({ userId: auth.userId }, 'Login failed: invalid password')
			return failure({ type: 'NOT_FOUND', message: 'Invalid credentials.' })
		}

		const userResult = await this.userRepository.findById(auth.userId)
		if (userResult.isFailure()) return failure(userResult.error)

		const token = this.generateToken(auth.userId, auth.email)
		logger.info({ userId: auth.userId }, 'Login successful')

		const hasBodyMetrics = await this.bodyMetricService.hasBodyMetrics(userResult.value.id)

		const userResponse = this.toResponse(userResult.value, hasBodyMetrics)
		if (userResponse.isFailure()) return failure(userResponse.error)

		return success({ user: userResponse.value, token })
	}

	async register(data: CreateUserWithAuthDTO): Promise<Result<InternalAuthResponse>> {
		const { auth, ...userData } = data

		const passwordHash = await this.hashPassword(auth.password)

		const userResult = await this.userRepository.create(userData)
		if (userResult.isFailure()) return failure(userResult.error)

		const userId = userResult.value.id

		const authResult = await this.authRepository.create({ ...auth, password: passwordHash }, userId)
		if (authResult.isFailure()) {
			await this.userRepository.delete(userId)
			return failure(authResult.error)
		}

		const fullUser = { ...userResult.value, auth: authResult.value }
		const userResponse = this.toResponse(fullUser, false)
		if (userResponse.isFailure()) return failure(userResponse.error)

		const token = this.generateToken(userId, auth.email)

		logger.info({ userId }, 'User created successfully')
		return success({ user: userResponse.value, token })
	}

	async changePassword(userId: string, data: ChangePasswordDTO): Promise<Result<boolean>> {
		const authResult = await this.findAuthOrFail(userId)
		if (authResult.isFailure()) return failure(authResult.error)

		const auth = authResult.value
		const isValidPassword = await this.verifyPassword(data.oldPassword, auth.password)
		if (!isValidPassword) {
			logger.warn({ userId }, 'Password change failed: invalid old password')
			return failure({ type: 'UNAUTHORIZED', message: 'Invalid credentials.' })
		}

		const newHash = await this.hashPassword(data.newPassword)
		const updateResult = await this.authRepository.updatePassword(userId, newHash)
		if (updateResult.isFailure()) return failure(updateResult.error)

		logger.info({ userId }, 'Password changed successfully')
		return success(true)
	}

	async changeEmail(userId: string, data: ChangeEmailDTO): Promise<Result<boolean>> {
		const authResult = await this.findAuthOrFail(userId)
		if (authResult.isFailure()) return failure(authResult.error)

		const isValidPassword = await this.verifyPassword(data.password, authResult.value.password)
		if (!isValidPassword) {
			logger.warn({ userId }, 'Email change failed: invalid password')
			return failure({ type: 'UNAUTHORIZED', message: 'Invalid credentials.' })
		}

		const updateResult = await this.authRepository.updateEmail(userId, data.newEmail)
		if (updateResult.isFailure()) return failure(updateResult.error)

		logger.info({ userId }, 'Email changed successfully')
		return success(true)
	}
}
