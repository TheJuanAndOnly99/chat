import { Room } from "../../Rooms/domain/Room";
import { Model } from "mongoose";
import { RoomRepository } from "../../Rooms/domain/RoomRepository";
import { Message } from "../../Messages/domain/Message";

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

  async findByName(name: string): Promise<Room | null> {
    // Find a room by name in the database
    return this.roomModel.findOne({ name: name }).exec();
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

  async getAllMessages(Uid: string): Promise<Message[] | null> {
    // Get the room document by ID
    const room = await this.roomModel.findById(Uid).exec();
  
    if (room) {
      // Extract and return the 'messages' field from the room document
      const messages: Message[] = room.messages;
      return messages;
    } else {
      return null;
    }
  }
}
