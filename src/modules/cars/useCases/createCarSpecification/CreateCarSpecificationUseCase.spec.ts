import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe("Create car specification", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );
  });

  it("should be able to add a new specification for a car", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Civic",
      description: "7th gen civic",
      daily_rate: 30,
      license_plate: "BL0WNUP",
      fine_amount: 15,
      brand: "Honda",
      category_id: "1",
    });
    const specification = await specificationsRepositoryInMemory.create({
      name: "test spec",
      description: "spec for new car",
    });

    const carAfterAddingSpecifications =
      await createCarSpecificationUseCase.execute({
        car_id: car.id,
        specifications_id: [specification.id],
      });

    expect(carAfterAddingSpecifications.specifications.length).toBe(1);
  });

  it("should not be able to add a new specification for a car that doesn't exist", async () => {
    const car_id = "1234";
    const specifications_id = ["2378621"];
    await expect(() =>
      createCarSpecificationUseCase.execute({
        car_id,
        specifications_id,
      })
    ).rejects.toEqual(new AppError("Car does not exist!"));
  });
});
