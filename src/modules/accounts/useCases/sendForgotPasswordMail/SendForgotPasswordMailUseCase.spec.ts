import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepository: UsersRepositoryInMemory;
let usersTokensRepository: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;

describe("Send forgot mail", () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    usersTokensRepository = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();

    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepository,
      usersTokensRepository,
      dateProvider,
      mailProvider
    );
  });

  it("should be able to send a forgot password mail to user", async () => {
    const sendMailSpy = jest.spyOn(mailProvider, "sendMail");

    await usersRepository.create({
      driver_license: "123124",
      email: "nowcohot@pi.fk",
      name: "Hattie Pope",
      password: "bestpasswordever",
    });

    await sendForgotPasswordMailUseCase.execute("nowcohot@pi.fk");

    expect(sendMailSpy).toHaveBeenCalled();
  });

  it("should not be able to send a mail if user does not exist", () => {
    expect(async () => {
      await sendForgotPasswordMailUseCase.execute("wut@piwu.sr");
    }).rejects.toEqual(new AppError("User does not exist!"));
  });

  it("should create a user's token to base the password retrieval link on", async () => {
    const createTokenForLinkSpy = jest.spyOn(usersTokensRepository, "create");
    await usersRepository.create({
      driver_license: "123124",
      email: "depitdal@teju.ye",
      name: "Samuel Edwards",
      password: "bestpasswordever",
    });

    await sendForgotPasswordMailUseCase.execute("depitdal@teju.ye");

    expect(createTokenForLinkSpy).toHaveBeenCalled();
  });
});
