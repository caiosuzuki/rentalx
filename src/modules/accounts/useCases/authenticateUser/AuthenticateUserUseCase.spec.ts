import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

describe("Authenticate user", () => {
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let usersRepositoryInMemory: UsersRepositoryInMemory;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to authenticate user", async () => {
    const user: ICreateUserDTO = {
      driver_license: "213213",
      email: "user@test.com",
      name: "John Testy",
      password: "goodpassword1234",
    };
    await createUserUseCase.execute(user);

    const authenticationInfo = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(authenticationInfo).toHaveProperty("token");
  });

  it("should not be able to authenticate a nonexistent user", async () => {
    await expect(() =>
      authenticateUserUseCase.execute({
        email: "randomemail@test.com",
        password: "goodpassword1234",
      })
    ).rejects.toEqual(new AppError("Email or password is incorrect!"));
  });

  it("should not be able to authenticate a user with wrong password", async () => {
    const user: ICreateUserDTO = {
      driver_license: "213213",
      email: "user@test.com",
      name: "John Testy",
      password: "goodpassword1234",
    };
    await createUserUseCase.execute(user);

    await expect(() =>
      authenticateUserUseCase.execute({
        email: user.email,
        password: "wrongpassord6789",
      })
    ).rejects.toEqual(new AppError("Email or password is incorrect!"));
  });
});
