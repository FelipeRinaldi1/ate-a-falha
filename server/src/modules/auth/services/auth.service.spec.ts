import { describe, it, expect, beforeEach } from 'vitest'
import { AuthService } from './auth.service.js'
import { InMemoryAuthRepository } from '../repositories/in-memory-auth.repository.js'
import { compare } from 'bcryptjs'
import { ERROR_MESSAGES } from '../../../@constants/messages/errors.messages.js'
import { GENDER } from '@prisma/client'

describe('Auth Service Unit Tests', () => {
    let authRepository: InMemoryAuthRepository;
    let authService: AuthService;

    const createValidUserData = (overrides = {}) => ({
        name: 'Tester',
        email: 'tester@example.com',
        password: 'Password123!',
        birthDate: new Date('2000-01-01'),
        gender: 'MALE' as GENDER,
        weight: 80.5,
        height: 180,
        activityLevel: 1.55,
        ...overrides
    });

    beforeEach(() => {
        authRepository = new InMemoryAuthRepository();
        authService = new AuthService(authRepository)
    });

    describe('Register', () => {
        it('should register a user successfully', async () => {
            const userData = createValidUserData();

            const result = await authService.registerUser(userData);

            expect(result).toHaveProperty('id')
            expect(result.name).toBe(userData.name)
            expect(result).not.toHaveProperty('password')

            const savedUser = await authRepository.findByEmail(userData.email);
            expect(savedUser).toBeTruthy();
            expect(savedUser?.user.name).toBe(userData.name);
            
            expect(savedUser?.user.bodyMetrics).toHaveLength(1);
            expect(savedUser?.user.bodyMetrics[0].weight).toBe(userData.weight);
        });

        it('should hash the password before saving', async () => {
            const userData = createValidUserData({
                name: 'Hacker',
                email: 'secure@example.com',
                password: 'Password123@'
            });

            await authService.registerUser(userData)

            const savedUser = await authRepository.findByEmail(userData.email)

            expect(savedUser?.password).not.toBe(userData.password);

            const isHashValid = await compare(userData.password, savedUser!.password);
            expect(isHashValid).toBe(true);
        })

        it("should reject registration with duplicate email", async () => {
            const userData = createValidUserData({ email: 'duplicate@example.com' });

            await authService.registerUser(userData)

            await expect(
                authService.registerUser(userData)
            ).rejects.toEqual(expect.objectContaining({
                message: ERROR_MESSAGES.CONFLICT.EMAIL_ALREADY_EXISTS
            }))
        })
    })

    describe('Login', () => {
        it('should authenticate user with correct credentials', async () => {
            const email = 'login@test.com';
            const password = 'StrongPassword123!';
            
            await authService.registerUser(createValidUserData({
                name: 'Login User',
                email,
                password
            }));

            const response = await authService.loginUser({ email, password });

            expect(response).toHaveProperty('token');
            expect(response.user.email).toBe(email);
            expect(response.user).not.toHaveProperty('password');
        });

        it('should not authenticate with wrong password', async () => {
            const email = 'wrongpass@test.com';
            
            await authService.registerUser(createValidUserData({
                email,
                password: 'CorrectPassword123!'
            }));

            await expect(
                authService.loginUser({ email, password: 'WrongPassword!!!' })
            ).rejects.toEqual(expect.objectContaining({
                message: ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS
            }));
        });

        it('should not authenticate with non-existent email', async () => {
            await expect(
                authService.loginUser({ 
                    email: 'ghost@test.com', 
                    password: '123' 
                })
            ).rejects.toEqual(expect.objectContaining({
                message: ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS
            }));
        });
    });

    describe('Change Password', () => {
        it('should change password ensuring old password is correct', async () => {
            const password = 'OldPassword123!';
            const newPassword = 'NewPassword456!';
            
            const userResponse = await authService.registerUser(createValidUserData({
                name: 'Change Pass',
                email: 'changepass@test.com',
                password
            }));

            await authService.changePassword(userResponse.id, {
                oldPassword: password,
                newPassword: newPassword
            });

            const updatedUserInDb = await authRepository.findById(userResponse.id);
            const isNewPasswordValid = await compare(newPassword, updatedUserInDb!.password);
            
            expect(isNewPasswordValid).toBe(true);
        });

        it('should reject password change if old password is wrong', async () => {
            const userResponse = await authService.registerUser(createValidUserData({
                password: 'OriginalPassword!'
            }));

            await expect(
                authService.changePassword(userResponse.id, {
                    oldPassword: 'WrongOldPassword',
                    newPassword: 'NewPassword123'
                })
            ).rejects.toEqual(expect.objectContaining({
                message: ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS
            }));
        });
    });

    describe('Change Email', () => {
        it('should change email ensuring password is correct', async () => {
            const password = 'Password123!';
            const newEmail = 'newemail@test.com';
            const oldEmail = 'oldemail@test.com';
            
            const userResponse = await authService.registerUser(createValidUserData({
                name: 'Change Email User',
                email: oldEmail,
                password
            }));

            const result = await authService.changeEmail(userResponse.id, {
                password: password,
                newEmail: newEmail
            });

            expect(result.email).toBe(newEmail);

            const updatedUserInDb = await authRepository.findById(userResponse.id);
            expect(updatedUserInDb?.email).toBe(newEmail);
        });

        it('should reject email change if password is wrong', async () => {
            const email = 'original@test.com';
            const userResponse = await authService.registerUser(createValidUserData({
                email,
                password: 'Password123!'
            }));

            await expect(
                authService.changeEmail(userResponse.id, {
                    password: 'WrongPassword', 
                    newEmail: 'hacker@test.com'
                })
            ).rejects.toEqual(expect.objectContaining({
                message: ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS
            }));
            
            const userInDb = await authRepository.findById(userResponse.id);
            expect(userInDb?.email).toBe(email);
        });
    });
});