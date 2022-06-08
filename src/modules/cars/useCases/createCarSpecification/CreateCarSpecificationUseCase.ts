import { inject, injectable } from "tsyringe";

import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { ISpecificationsRepository } from "@modules/cars/repositories/ISpecificationsRepository";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  car_id: string;
  specifications_id: string[];
}

@injectable()
class CreateCarSpecificationUseCase {
  constructor(
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,

    @inject("SpecificationsRepository")
    private specificationsRepository: ISpecificationsRepository
  ) {}

  async execute({ car_id, specifications_id }: IRequest): Promise<Car> {
    const desiredCar = await this.carsRepository.findById(car_id);

    if (!desiredCar) {
      throw new AppError("Car does not exist!");
    }

    const specifications = await this.specificationsRepository.findByIds(
      specifications_id
    );

    desiredCar.specifications = specifications;

    await this.carsRepository.create(desiredCar);

    return desiredCar;
  }
}

export { CreateCarSpecificationUseCase };
