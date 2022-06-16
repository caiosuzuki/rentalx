import { Request, Response } from "express";
import { container } from "tsyringe";

import { ReturnRentalCarUseCase } from "./ReturnRentalCarUseCase";

class ReturnRentalCarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id: user_id } = request.user;
    const returnRentalCarUseCase = container.resolve(ReturnRentalCarUseCase);

    const rental = await returnRentalCarUseCase.execute({ id, user_id });

    return response.status(200).json(rental);
  }
}

export { ReturnRentalCarController };
