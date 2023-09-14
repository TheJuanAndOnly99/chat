import mongoose from "mongoose";
import { UserId } from "../../Users/domain/UserId";
import { UserName } from "../../Users/domain/UserName";
import { UserEmail } from "../../Users/domain/UserEmail";
import { UserPassword } from "../../Users/domain/UserPassword";

// User interface for mongoose
export interface IUser extends mongoose.Document {
  Uid: UserId,
  username: UserName,
  email: UserEmail,
  password?: UserPassword,
}

// User schema for mongoose
export const UserSchema = new mongoose.Schema<IUser>({
  Uid: {
    type: String
  },
  username: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  }
},
{
  timestamps: true
});

// User model for mongoose
export const userModel: mongoose.Model<IUser> =  mongoose.model<IUser>('User', UserSchema);