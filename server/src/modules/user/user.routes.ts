import { Router } from "express";
import userController from "./user.controller.js";

const userRouter = Router({ mergeParams: true });

userRouter.get("/",userController.getAllUsers)
userRouter.get("/:user_id",userController.getUserById)

export default userRouter;