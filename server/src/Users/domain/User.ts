import { UserId } from "./UserId";
import { UserName } from "./UserName";
import { UserEmail } from "./UserEmail";
import { UserPassword } from "./UserPassword";

// The class uses different value objects (UserId, UserName, UserEmail, and UserPassword) to ensure type safety and encapsulate specific rules and behaviors related to each attribute.
export class User {
  constructor(
    readonly Uid: UserId,
    readonly username: UserName,
    readonly email: UserEmail,
    readonly password: UserPassword,
    // readonly conversationIds?: ConversationId[],
    // readonly messageIds?: MessageId[]
  ) {}
}
