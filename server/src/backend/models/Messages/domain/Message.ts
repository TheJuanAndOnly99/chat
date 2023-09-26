import { MessageId } from "./MessageId";

export class Message {
  constructor(
    readonly Uid: MessageId,
    readonly text: string,
    readonly userId: string
  ) {}
}
