import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  id: string;
  user_id: string;
}

@injectable()
class ReturnRentalCarUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ id, user_id }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(id);

    if (!rental) {
      throw new AppError("Rental doesn't exist!");
    }

    rental.total = await this.calculateTotalRentalPrice(rental);

    rental.end_date = this.dateProvider.now();
    await this.rentalsRepository.create(rental);
    await this.carsRepository.updateAvailability(rental.car_id, true);
    return rental;
  }

  private async calculateTotalRentalPrice(rental: Rental): Promise<number> {
    const minimumAmountOfDays = 1;
    const car = await this.carsRepository.findById(rental.car_id);

    const now = this.dateProvider.now();
    let daysRented = this.dateProvider.compareInDays(rental.start_date, now);
    if (daysRented < minimumAmountOfDays) {
      daysRented = minimumAmountOfDays;
    }
    const daysExceeded = this.dateProvider.compareInDays(
      now,
      rental.expected_return_date
    );

    let total = 0;

    if (daysExceeded > 0) {
      console.log(">>> DAYS EXCEEDED", daysExceeded);
      const fine = daysExceeded * car.fine_amount;
      total = fine;
    }

    total += daysRented * car.daily_rate;
    return total;
  }
}

export { ReturnRentalCarUseCase };
