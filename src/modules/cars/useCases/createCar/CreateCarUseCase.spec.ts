import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepository: CarsRepositoryInMemory;

describe("Create car", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepository);
  });

  it("should be able to create a new car", async () => {
    const car = await createCarUseCase.execute({
      name: "Civic",
      description: "7th gen civic",
      daily_rate: 30,
      license_plate: "BL0WNUP",
      fine_amount: 15,
      brand: "Honda",
      category_id: "1",
    });

    expect(car).toHaveProperty("id");
  });

  it("should not be able to create a new car with existing license plate", () => {
    expect(async () => {
      await createCarUseCase.execute({
        name: "Car 1",
        description: "7th gen civic",
        daily_rate: 30,
        license_plate: "BL0WNUP",
        fine_amount: 15,
        brand: "Honda",
        category_id: "1",
      });

      await createCarUseCase.execute({
        name: "Car 2",
        description: "7th gen civic",
        daily_rate: 30,
        license_plate: "BL0WNUP",
        fine_amount: 15,
        brand: "Honda",
        category_id: "1",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("it should create a new car as available by default", async () => {
    const car = await createCarUseCase.execute({
      name: "Civic",
      description: "7th gen civic",
      daily_rate: 30,
      license_plate: "BL0WNUP",
      fine_amount: 15,
      brand: "Honda",
      category_id: "1",
    });

    expect(car.available).toBe(true);
  });
});
