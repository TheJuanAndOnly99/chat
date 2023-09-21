import { Message } from "../domain/Message";
import { MessageId } from "../domain/MessageId";
import { MessageRepository } from "../domain/MessageRepository";
import { MessageCreatorRequest } from "./requests/MessageCreatorRequest";


// The messageCreator class is responsible for creating and storing new users. It receives a request object with the message data and uses the messageRepository interface to store the message in the database.
export class MessageCreator {
	constructor(private readonly repository: MessageRepository) {}

  // Create and store new room
	async create({ Uid, text, userId }: MessageCreatorRequest): Promise<void> {
		const message = new Message(
			new MessageId(Uid),
      text,
			userId
		);
		await this.repository.create(message);
	}
}