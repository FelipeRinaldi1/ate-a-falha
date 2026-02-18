import { Router } from "express";
import { BodyMetricsFactory } from "../factory/body-metrics.factory.js";
import { ensureAuthenticated } from "../../../middlewares/ensureAuthenticated.js";

const bodyMetricsController = BodyMetricsFactory.create();
const bodyMetricsRouter = Router();

bodyMetricsRouter.get('/latest', ensureAuthenticated,bodyMetricsController.getLatestFromUser);

bodyMetricsRouter.post('/', ensureAuthenticated,bodyMetricsController.create);
bodyMetricsRouter.get('/', ensureAuthenticated,bodyMetricsController.getAllFromUser);

bodyMetricsRouter.get('/:id', ensureAuthenticated,bodyMetricsController.getById);
bodyMetricsRouter.put('/:id', ensureAuthenticated,bodyMetricsController.update);
bodyMetricsRouter.delete('/:id', ensureAuthenticated,bodyMetricsController.delete);

export { bodyMetricsRouter };