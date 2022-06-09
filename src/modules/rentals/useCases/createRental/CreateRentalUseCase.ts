import { Rental } from "@modules/rentals/infra/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

class CreateRentalUseCase {
  constructor(private rentalsRepository: IRentalsRepository) {}

  async execute({
    user_id,
    car_id,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    const pendingRentalForCar =
      await this.rentalsRepository.findPendingRentalByCar(car_id);

    if (pendingRentalForCar) {
      throw new AppError("Car is unavailable");
    }

    const pendingRentalForUser =
      await this.rentalsRepository.findPendingRentalByUser(user_id);
    if (pendingRentalForUser) {
      throw new AppError("There's a rental in progress for this user.");
    }

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    return rental;
  }
}
export { CreateRentalUseCase };
