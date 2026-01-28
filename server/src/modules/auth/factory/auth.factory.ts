import { AuthService } from "../services/auth.service.js";
import { AuthRepository } from "../repositories/auth.repository.js";
import { AuthController } from "../http/auth.controller.js";

export function authFactory(){    
    const authRepository  = new AuthRepository()
    const authService  = new AuthService(authRepository);
    const authController = new AuthController(authService)

    return authController;
}