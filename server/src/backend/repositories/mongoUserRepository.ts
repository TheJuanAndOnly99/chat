import { User } from "../../Users/domain/User";
import { UserEmail } from "./UserEmail";
import { Model } from "mongoose";

export class MongoUserRepository implements UserRepository {
  private userModel: Model<User>;

  constructor(userModel: Model<User>) {
    this.userModel = userModel;
  }

  async create(user: User): Promise<void> {
    // Save the user to the database
    await this.userModel.create(user);
  }

  async findByEmail(email: UserEmail): Promise<User | null> {
    // Find a user by email in the database
    return this.userModel.findOne({ email: email.value }).exec();
  }

  async findAllExceptUser(email: UserEmail): Promise<User[]> {
    // Find all users except the user with the given email in the database
    return this.userModel.find({ email: { $ne: email.value } }).exec();
  }
}
