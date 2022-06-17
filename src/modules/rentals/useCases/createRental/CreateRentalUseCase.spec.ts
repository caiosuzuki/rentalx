import dayjs from "dayjs";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepository: ICarsRepository;
let dayjsDateProvider: DayjsDateProvider;

describe("Create Rental", () => {
  const tomorrow = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepository = new CarsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      carsRepository,
      rentalsRepositoryInMemory,
      dayjsDateProvider
    );
  });

  it("should be able to create a new rental", async () => {
    const car = await carsRepository.create({
      name: "Fusion",
      description: "V6 Sedan",
      daily_rate: 10,
      license_plate: "IUY7867",
      fine_amount: 15,
      category_id: "1233",
      brand: "Ford",
    });

    const rental = await createRentalUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date: tomorrow,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if there's a pending rental for user", async () => {
    await rentalsRepositoryInMemory.create({
      user_id: "12345",
      car_id: "232313",
      expected_return_date: tomorrow,
    });

    await expect(() =>
      createRentalUseCase.execute({
        user_id: "12345",
        car_id: "12312321",
        expected_return_date: tomorrow,
      })
    ).rejects.toEqual(
      new AppError("There's a rental in progress for this user.")
    );
  });

  it("should not be able to create a new rental if there's a pending rental for car", async () => {
    await rentalsRepositoryInMemory.create({
      user_id: "3213123",
      car_id: "232313",
      expected_return_date: tomorrow,
    });

    await expect(() =>
      createRentalUseCase.execute({
        user_id: "123123123345",
        car_id: "232313",
        expected_return_date: tomorrow,
      })
    ).rejects.toEqual(new AppError("Car is unavailable"));
  });

  it("should not be able to create a new rental with invalid return date", async () => {
    await expect(() =>
      createRentalUseCase.execute({
        user_id: "123123123345",
        car_id: "232313",
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(
      new AppError(
        "Invalid return date, rental's minimum duration is 24 hours."
      )
    );
  });
});
