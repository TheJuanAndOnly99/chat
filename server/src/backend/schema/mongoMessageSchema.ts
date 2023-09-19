import mongoose from "mongoose";
import { MessageId } from "../../Messages/domain/MessageId";


// Room interface for mongoose
export interface IMessage extends mongoose.Document {
  Uid: MessageId,
  text: string,
}

// Message schema for mongoose
export const MessageSchema = new mongoose.Schema<IMessage>({
  Uid: {
    type: String,
  },
  text: {
    type: String,
  },
},
{
  timestamps: true,
});

// Message model for mongoose
export const messageModel: mongoose.Model<IMessage> =  mongoose.model<IMessage>('Message', MessageSchema);