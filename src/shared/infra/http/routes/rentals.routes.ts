import { Router } from "express";

import { ReturnRentalCarController } from "@modules/cars/useCases/returnRentalCarUseCase/ReturnRentalCarController";
import { CreateRentalController } from "@modules/rentals/useCases/createRental/CreateRentalController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const createRentalController = new CreateRentalController();
const returnRentalCarController = new ReturnRentalCarController();

const rentalsRoutes = Router();

rentalsRoutes.post("/", ensureAuthenticated, createRentalController.handle);
rentalsRoutes.post(
  "/return/:id",
  ensureAuthenticated,
  returnRentalCarController.handle
);

export { rentalsRoutes };
