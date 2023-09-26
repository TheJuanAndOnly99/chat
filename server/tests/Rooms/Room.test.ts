import { Room } from "../../src/backend/models/Rooms/domain/Room";
import { RoomId } from "../../src/backend/models/Rooms/domain/RoomId";
import { RoomCreator } from "../../src/backend/models/Rooms/application/RoomCreator";
import { RoomRepository } from "../../src/backend/models/Rooms/domain/RoomRepository";
import { mock, MockProxy } from "jest-mock-extended";

describe("RoomCreator", () => {
  let repository: MockProxy<RoomRepository> & RoomRepository;
  let roomCreator: RoomCreator;

  beforeEach(() => {
    repository = mock<RoomRepository>();
    roomCreator = new RoomCreator(repository);
  });

  it("should create a room correctly", async () => {
    const request = {
      Uid: "1",
      name: "testRoomName",
    };

    const expectedRoom = new Room(
      new RoomId(request.Uid),
      request.name,
    );

    await roomCreator.create(request);

    expect(repository.create).toBeCalledWith(expectedRoom);
  });
});