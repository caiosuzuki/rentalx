import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepository: CarsRepositoryInMemory;

describe("List cars", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepository);
  });

  it("should be able to list all available cars", async () => {
    const car = await carsRepository.create({
      name: "Fusca",
      description: "Old Beetle",
      brand: "Volkswagen",
      daily_rate: 5,
      fine_amount: 6,
      license_plate: "YYU-8899",
      category_id: "cat_id",
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by brand", async () => {
    const car = await carsRepository.create({
      name: "Fusca",
      description: "Old Beetle",
      brand: "Volkswagen",
      daily_rate: 5,
      fine_amount: 6,
      license_plate: "YYU-8899",
      category_id: "cat_id",
    });

    await carsRepository.create({
      name: "325i",
      description: "E36",
      brand: "BMW",
      daily_rate: 150,
      fine_amount: 6,
      license_plate: "UUI-8912",
      category_id: "cat_id",
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: "Volkswagen",
    });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by name", async () => {
    const car = await carsRepository.create({
      name: "Fusca",
      description: "Old Beetle",
      brand: "Volkswagen",
      daily_rate: 5,
      fine_amount: 6,
      license_plate: "YYU-8899",
      category_id: "cat_id",
    });

    await carsRepository.create({
      name: "Passat",
      description: "Old passat",
      brand: "Volkswagen",
      daily_rate: 150,
      fine_amount: 6,
      license_plate: "UUI-8912",
      category_id: "cat_id",
    });

    const cars = await listAvailableCarsUseCase.execute({ name: "Fusca" });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by category_id", async () => {
    const car = await carsRepository.create({
      name: "Fusca",
      description: "Old Beetle",
      brand: "Volkswagen",
      daily_rate: 5,
      fine_amount: 6,
      license_plate: "YYU-8899",
      category_id: "cat_id_1",
    });

    await carsRepository.create({
      name: "Passat",
      description: "Old passat",
      brand: "Volkswagen",
      daily_rate: 150,
      fine_amount: 6,
      license_plate: "UUI-8912",
      category_id: "cat_id_2",
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: "cat_id_1",
    });

    expect(cars).toEqual([car]);
  });
});
