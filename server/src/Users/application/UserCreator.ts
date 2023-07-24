import { User } from "../domain/User";
import { UserEmail } from "../domain/UserEmail";
import { UserId } from "../domain/UserId";
import { UserName } from "../domain/UserName";
import { UserPassword } from "../domain/UserPassword";
import { UserRepository } from "../domain/UserRepository";
import { UserCreatorRequest } from "./requests/UserCreatorRequest";


// The UserCreator class is responsible for creating and storing new users. It receives a request object with the user data and uses the UserRepository interface to store the user in the database.
export class UserCreator {
	constructor(private readonly repository: UserRepository) {}

  // Create and store new user
	async create({ id, username, email, password }: UserCreatorRequest): Promise<void> {
		const user = new User(
			new UserId(id),
      new UserName(username),
      new UserEmail(email),
      new UserPassword(password)
		);
		await this.repository.create(user);
	}
}