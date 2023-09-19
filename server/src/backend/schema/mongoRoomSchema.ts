import mongoose from "mongoose";
import { RoomId } from "../../Rooms/domain/RoomId";
import { User } from "../../Users/domain/User";
import { Message } from "../../Messages/domain/Message";

// Room interface for mongoose
export interface IRoom extends mongoose.Document {
  Uid: RoomId,
  users: User[],
  messages: Message[],
}

// Room schema for mongoose
export const RoomSchema = new mongoose.Schema<IRoom>({
  Uid: {
    type: String,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message', // Reference to the Message model
    },
  ],
},
{
  timestamps: true,
});

// Room model for mongoose
export const roomModel: mongoose.Model<IRoom> =  mongoose.model<IRoom>('Room', RoomSchema);