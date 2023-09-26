import { UserId } from "./UserId";
import { UserName } from "./UserName";
import { UserEmail } from "./UserEmail";
import { UserPassword } from "./UserPassword";

export class User {
  constructor(
    readonly Uid: UserId,
    readonly username: UserName,
    readonly email: UserEmail,
    readonly password: UserPassword,
    // readonly messageIds?: MessageId[]
  ) {}
}
