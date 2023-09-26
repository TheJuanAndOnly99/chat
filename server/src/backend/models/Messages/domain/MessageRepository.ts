import { Message } from "./Message";

export interface MessageRepository {
	create(message: Message): Promise<void>;

	findById(id: string): Promise<Message| null>;

	delete(id: string): Promise<void>;
}