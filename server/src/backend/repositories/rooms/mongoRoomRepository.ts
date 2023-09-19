import { Room } from "../../../Rooms/domain/Room";
import { Model } from "mongoose";
import { RoomRepository } from "../../../Rooms/domain/RoomRepository";

export class MongoRoomRepository implements RoomRepository {
  private roomModel: Model<Room>;

  constructor(roomModel: Model<Room>) {
    this.roomModel = roomModel;
  }

  async create(room: Room): Promise<void> {
    // Save the room to the database
    await this.roomModel.create(room);
  }

  async findAll(): Promise<Room[]> {
    // Find all rooms in the database
    return this.roomModel.find().exec();
  }

  async findById(Uid: string): Promise<Room | null> {
    // Find a room by id in the database
    return this.roomModel.findById(Uid).exec();
  }

  async delete(Uid: string): Promise<void> {
    // Delete a room by id in the database
    await this.roomModel.deleteOne({ _id: Uid }).exec();
  }

  async addUser(Uid: string, userId: string): Promise<void> {
    // Add a user to a room by id in the database
    await this.roomModel.updateOne({ _id: Uid }, { $push: { users: userId } }).exec();
  }

  async removeUser(Uid: string, userId: string): Promise<void> {
    // Remove a user from a room by id in the database
    await this.roomModel.updateOne({ _id: Uid }, { $pull: { users: userId } }).exec();
  }

  async addMessage(Uid: string, messageId: string): Promise<void> {
    // Add a message to a room by id in the database
    await this.roomModel.updateOne({ _id: Uid }, { $push: { messages: messageId } }).exec();
  }
}
