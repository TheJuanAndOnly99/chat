import { User } from "../../../Users/domain/User";
import { UserEmail } from "../../../Users/domain/UserEmail";
import { UserName } from "../../../Users/domain/UserName";
import { Model } from "mongoose";
import { UserRepository } from "../../../Users/domain/UserRepository";

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

  async findAll(): Promise<User[]> {
    // Find all users in the database
    return this.userModel.find().exec();
  }

  async findById(Uid: string): Promise<User | null> {
    // Find a user by id in the database
    return this.userModel.findById(Uid).exec();
  }

  async delete(Uid: string): Promise<void> {
    // Delete a user by id in the database
    await this.userModel.deleteOne({ _id: Uid }).exec();
  }

  async findByUsername(username: UserName): Promise<User | null> {
    // Find a user by username in the database
    return this.userModel.findOne({ username: username.value }).exec();
  }
}
