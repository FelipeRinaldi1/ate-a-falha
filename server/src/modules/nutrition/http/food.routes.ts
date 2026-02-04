import { Router } from "express";
import { foodFactory } from "../factory/food.factory.js";
import { setFoodId } from "../middleware/food.setFoodId.js";
import { ensureAuthenticated } from "../../../middlewares/ensureAuthenticated.js";

const foodRouter = Router({mergeParams:true})

const foodController = foodFactory()


foodRouter.post('/',ensureAuthenticated,foodController.create)
foodRouter.post('/',ensureAuthenticated,foodController.searchFoods)
foodRouter.patch('/:id',ensureAuthenticated,setFoodId,foodController.update)
foodRouter.delete('/:id',ensureAuthenticated,setFoodId,foodController.delete)