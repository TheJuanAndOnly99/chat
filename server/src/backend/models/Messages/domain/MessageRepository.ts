import { Message } from "../../Messages/domain/Message";

export interface MessageRepository {
	create(message: Message): Promise<void>;

	findById(id: string): Promise<Message| null>;

	delete(id: string): Promise<void>;
}