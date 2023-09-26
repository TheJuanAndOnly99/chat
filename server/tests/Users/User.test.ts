import { User } from "../../src/backend/models/Users/domain/User";
import { UserId } from "../../src/backend/models/Users/domain/UserId";
import { UserName } from "../../src/backend/models/Users/domain/UserName";
import { UserCreator } from "../../src/backend/models/Users/application/UserCreator";
import { UserRepository } from "../../src/backend/models/Users/domain/UserRepository";
import { UserEmail, UserEmailIsNotValid } from "../../src/backend/models/Users/domain/UserEmail";
import { UserPassword, UserPasswordNotValid } from "../../src/backend/models/Users/domain/UserPassword";
import { mock, MockProxy } from "jest-mock-extended";
import bcrypt from "bcrypt";

jest.mock("bcrypt", () => ({
	hashSync: jest.fn(() => "hashedPassword"),
	compare: jest.fn(),
}));

describe("UserCreator", () => {
  let repository: MockProxy<UserRepository> & UserRepository;
	let userCreator: UserCreator;

	beforeEach(() => {
		repository = mock<UserRepository>();
		userCreator = new UserCreator(repository);
	});

	it("should create a user correctly", async () => {
		const request = {
			Uid: "1",
      username: "testUserName",
      email: "test@email.com",
      password: "1testPassword!"
		};

		const expectedUser = new User(
			new UserId(request.Uid),
      new UserName(request.username),
      new UserEmail(request.email),
      new UserPassword(request.password)
		);

		await userCreator.create(request);

		expect(repository.create).toBeCalledWith(expectedUser);
	});

  it("should throw error when username is longer than 15 characters", async () => {
		const request = {
			Uid: "1",
			username: "veryLongUserNameThatExceeds15Characters",
      email: "test@email.com",
      password: "1testPassword!"
		};

		await expect(userCreator.create(request)).rejects.toThrow();
	});

  it("should throw an error when the user email is not valid", async () => {
		const request = {
			Uid: "1",
			username: "Test",
			email: "invalid email",
      password: "1testPassword!"
		};

		await expect(userCreator.create(request)).rejects.toThrow(UserEmailIsNotValid);
	});

  it("should throw an error when the user password is not valid", async () => {
		const request = {
			Uid: "1",
			username: "Test",
			email: "test@email.com",
			password: "invalid password",
		};

		await expect(userCreator.create(request)).rejects.toThrow(UserPasswordNotValid);
	});

  it("should generate a UUID for a new user", async () => {
		const request = {
			Uid: "",
			username: "Test",
			email: "test@email.com",
			password: "1testPassword!",
		};

		await userCreator.create(request);

		expect(repository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				Uid: expect.any(UserId),
			})
		);
	});

  it("should encrypt the password of a new user", async () => {
		const request = {
			Uid: "1",
			username: "Test",
			email: "test@email.com",
			password: "1testPassword!",
		};

		const hashSyncSpy = jest.spyOn(bcrypt, "hashSync");

		await userCreator.create(request);

		expect(repository.create).toHaveBeenCalled();

		const userCreationCall = repository.create.mock.calls[0];
		const createdUser = userCreationCall[0];
		if (!createdUser.password) {
			throw new Error("Password not defined for user");
		}
		const hashedPassword = hashSyncSpy.mock.results[0].value; 

		expect(createdUser.password.value).toBe(hashedPassword);
	});

  it("should create a random username when one is not provided", async () => {
		const request = {
			Uid: "1",
			username: "",
			email: "test@email.com",
			password: "1testPassword!",
		};

		await userCreator.create(request);

		expect(repository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				username: expect.any(UserName),
			})
		);
	});
});