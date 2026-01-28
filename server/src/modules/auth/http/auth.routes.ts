import { Router } from "express";
import { authFactory } from "../factory/auth.factory.js";
import { ensureAuthenticated } from "../../../middlewares/ensureAuthenticated.js";

const authController = authFactory()

const authRouter = Router({ mergeParams: true });

authRouter.post("/register", authController.register.bind(authController));

authRouter.post("/login", authController.login.bind(authController));

authRouter.patch("/change-password", ensureAuthenticated, authController.changePassword.bind(authController));

authRouter.patch("/change-email", ensureAuthenticated, authController.changeEmail.bind(authController));
//To-do
//1 - Refresh Tokens
//2 - OAuth with google
//3 - Email verify
//4 - RateLimiter

export default authRouter;