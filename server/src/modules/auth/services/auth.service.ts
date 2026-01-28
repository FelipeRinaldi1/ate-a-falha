import { AuthMapper } from "../mapper/auth.mapper.js";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { RULES } from "../../../@constants/rules/index.js";
import { ENV } from "../../../config/env.js";
import { RegisterDTO, LoginDTO, ChangePasswordDTO, ChangeEmailDTO } from "../dtos/auth.schema.js";
import { AppError } from "../../../@utils/appError.js";
import { HTTP_STATUS } from "../../../@constants/global/httpCodesConstants.js";
import { ERROR_MESSAGES } from "../../../@constants/messages/errors.messages.js";
import { AuthResponseDTO,LoginResponseDTO } from "../dtos/auth.responses.js";
import { IAuthRepository } from "../dtos/auth.interfaces.js";
import { logger } from "../../../config/logger.js";

export class AuthService {
    private authRepository: IAuthRepository

    constructor(authRepository: IAuthRepository) {
        this.authRepository = authRepository
    }

    async registerUser(data: RegisterDTO): Promise<AuthResponseDTO> {
        logger.info({ email: data.email }, "Starting user registration")

        const passwordHash = await bcrypt.hash(data.password, RULES.AUTH.BCRYPT_ROUNDS);

        const newAccount = await this.authRepository.create({
            ...data,
            passwordHash
        })

        logger.info({ userId: newAccount.user.id }, "User registered successfully")

        const mappedAccount = AuthMapper.toHTTP(newAccount)

        return mappedAccount
    }

    async loginUser(data: LoginDTO): Promise<LoginResponseDTO> {
        logger.info({ email: data.email }, "Attempting login")

        const account = await this.authRepository.findByEmail(data.email)

        if (!account) {
            logger.warn({ email: data.email }, "Login failed: User not found")
            throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED)
        }

        const isPasswordValid = await bcrypt.compare(data.password, account.password)

        if (!isPasswordValid) {
            logger.warn({ userId: account.user.id }, "Login failed: Invalid password")
            throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED)
        }

        const token = jwt.sign(
            {
                id: account.user.id,
                email: account.email
            },
            ENV.JWT_SECRET,
            {
                subject: account.user.id,
                expiresIn: ENV.JWT_EXPIRES_IN
            } as SignOptions
        )

        logger.info({ userId: account.user.id }, "Login successful")

        return AuthMapper.toLogin(token, account)
    }

    async changePassword(userId: string, data: ChangePasswordDTO): Promise<AuthResponseDTO> {
        const account = await this.authRepository.findById(userId)

        if (!account) {
            throw new AppError(ERROR_MESSAGES.USER.NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        }

        const isOldPasswordCorrect = await bcrypt.compare(data.oldPassword, account.password)

        if (!isOldPasswordCorrect) {
            logger.warn({ userId }, "Password change failed: Invalid old password")
            throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED)
        }

        const newPassword = await bcrypt.hash(data.newPassword, RULES.AUTH.BCRYPT_ROUNDS)

        const updatedAccount = await this.authRepository.updatePassword(userId, newPassword)

        if (!updatedAccount) throw new AppError("Error updating password", HTTP_STATUS.INTERNAL_SERVER_ERROR)

        logger.info({ userId }, "Password changed successfully")

        return AuthMapper.toHTTP(updatedAccount)
    }

    async changeEmail(userId: string, data: ChangeEmailDTO): Promise<AuthResponseDTO> {
        const account = await this.authRepository.findById(userId)

        if (!account) {
            throw new AppError(ERROR_MESSAGES.USER.NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        }

        const isOldPasswordCorrect = await bcrypt.compare(data.password, account.password)

        if (!isOldPasswordCorrect) {
            logger.warn({ userId }, "Email change failed: Invalid password")
            throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED)
        }

        const updatedAccount = await this.authRepository.updateEmail(userId, data.newEmail)

        if (!updatedAccount) throw new AppError("Error updating email", HTTP_STATUS.INTERNAL_SERVER_ERROR)

        logger.info({ userId }, "Email changed successfully")

        return AuthMapper.toHTTP(updatedAccount)
    }
}