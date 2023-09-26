import { User } from "../../Users/domain/User";
import { UserEmail } from "./UserEmail";

export interface UserRepository {
	create(user: User): Promise<void>;

	findByEmail(email: UserEmail): Promise<User | null>;
	
	findAllExceptUser(email: UserEmail): Promise<User[]>;

	findById(id: string): Promise<User | null>;

	delete(id: string): Promise<void>;
}