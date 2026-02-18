import { Router } from "express";
import { foodFactory } from "../factory/food.factory.js";
import { ensureAuthenticated } from "../../../middlewares/ensureAuthenticated.js";

const foodRouter = Router({ mergeParams: true });
const foodController = foodFactory();

foodRouter.post('/', ensureAuthenticated, foodController.register);

foodRouter.get('/', ensureAuthenticated, foodController.searchFoods);

foodRouter.get('/:id', ensureAuthenticated, foodController.getById);

foodRouter.patch('/:id', ensureAuthenticated, foodController.update);

foodRouter.delete('/:id', ensureAuthenticated, foodController.delete);

export default foodRouter;