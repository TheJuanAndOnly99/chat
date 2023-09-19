import { Room } from "../domain/Room";
import { RoomId } from "../domain/RoomId";
import { RoomRepository } from "../domain/RoomRepository";
import { RoomCreatorRequest } from "./requests/RoomCreatorRequest";


// The RoomCreator class is responsible for creating and storing new users. It receives a request object with the room data and uses the roomRepository interface to store the room in the database.
export class RoomCreator {
	constructor(private readonly repository: RoomRepository) {}

  // Create and store new room
	async create({ Uid }: RoomCreatorRequest): Promise<void> {
		const room = new Room(
			new RoomId(Uid)
		);
		await this.repository.create(room);
	}

	// Delete existing room
	async delete(roomId: RoomId): Promise<void> {
    await this.repository.delete(roomId.value);
  }
}