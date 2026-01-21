import { Router } from "express";
import authController from "./auth.controller.js"

const authRouter = Router({ mergeParams: true });

authRouter.post("/register",authController.handleRegister.bind(authController));   
authRouter.post("/login",authController.handleLogin.bind(authController));


//To-do
//1 - Refresh Tokens
//2 - OAuth with google
//3 - Email verify

export default authRouter;