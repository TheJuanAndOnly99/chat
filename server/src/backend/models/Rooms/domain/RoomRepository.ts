import { Room } from "../../Rooms/domain/Room";

export interface RoomRepository {
	create(room: Room): Promise<void>;

	findById(id: string): Promise<Room| null>;

	findByName(name: string): Promise<Room | null>;

	delete(id: string): Promise<void>;
}