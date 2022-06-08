import { inject, injectable } from "tsyringe";

import { ICarImagesRepository } from "@modules/cars/repositories/ICarImagesRepository";

interface IRequest {
  car_id: string;
  images_names: string[];
}

@injectable()
class UploadCarImagesUseCase {
  constructor(
    @inject("CarImagesRepository")
    private carImagesRepository: ICarImagesRepository
  ) {}

  async execute({ car_id, images_names }: IRequest): Promise<void> {
    images_names.map(async (image) => {
      await this.carImagesRepository.create(car_id, image);
    });
  }
}
export { UploadCarImagesUseCase };
