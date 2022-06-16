import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({
    user_id,
    car_id,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    const minimumDurationOfRentalInHours = 24;
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

    const now = this.dateProvider.now();
    const expectedDurationOfRental = this.dateProvider.compareInHours(
      now,
      expected_return_date
    );

    if (expectedDurationOfRental < minimumDurationOfRentalInHours) {
      throw new AppError(
        "Invalid return date, rental's minimum duration is 24 hours."
      );
    }

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    await this.carsRepository.updateAvailability(car_id, false);

    return rental;
  }
}
export { CreateRentalUseCase };
