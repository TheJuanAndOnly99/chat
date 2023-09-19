import { Message } from "../../Messages/domain/Message";
import { Model } from "mongoose";
import { MessageRepository } from "../../Messages/domain/MessageRepository";

export class MongoMessageRepository implements MessageRepository {
  private messageModel: Model<Message>;

  constructor(messageModel: Model<Message>) {
    this.messageModel = messageModel;
  }

  async create(Message: Message): Promise<void> {
    // Save the Message to the database
    await this.messageModel.create(Message);
  }

  async findAll(): Promise<Message[]> {
    // Find all messages in the database
    return this.messageModel.find().exec();
  }

  async findById(Uid: string): Promise<Message | null> {
    // Find a message by id in the database
    return this.messageModel.findById(Uid).exec();
  }

  async delete(Uid: string): Promise<void> {
    // Delete a message by id in the database
    await this.messageModel.deleteOne({ _id: Uid }).exec();
  }
}
