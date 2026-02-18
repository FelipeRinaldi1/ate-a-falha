import { ExerciseFactory } from "../factory/exercise.factory.js";
import { Router } from "express";

const exerciseController = ExerciseFactory.createExerciseController();
const exerciseRouter = Router();

exerciseRouter.post("/", exerciseController.create)
exerciseRouter.get("/", exerciseController.getAll)
exerciseRouter.get("/:id", exerciseController.getById)
exerciseRouter.get("/search", exerciseController.search)
exerciseRouter.put("/:id", exerciseController.update)
exerciseRouter.delete("/:id", exerciseController.delete)

export {exerciseRouter}