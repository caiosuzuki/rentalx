import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { Rental } from "@modules/rentals/infra/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { AppError } from "@shared/errors/AppError";

dayjs.extend(utc);

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

    const now = dayjs().utc().local().format();
    const expectedReturnDateFormated = dayjs(expected_return_date)
      .utc()
      .local()
      .format();
    const compare = dayjs(expectedReturnDateFormated).diff(now, "hours");

    if (compare < minimumDurationOfRentalInHours) {
      throw new AppError(
        "Invalid return date, rental's minimum duration is 24 hours."
      );
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
