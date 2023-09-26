import { Message } from "../../src/backend/models/Messages/domain/Message";
import { MessageId } from "../../src/backend/models/Messages/domain/MessageId";
import { MessageCreator } from "../../src/backend/models/Messages/application/MessageCreator";
import { MessageRepository } from "../../src/backend/models/Messages/domain/MessageRepository";
import { mock, MockProxy } from "jest-mock-extended";

describe("MessageCreator", () => {
  let repository: MockProxy<MessageRepository> & MessageRepository;
  let messageCreator: MessageCreator;

  beforeEach(() => {
    repository = mock<MessageRepository>();
    messageCreator = new MessageCreator(repository);
  });

  it("should create a message correctly", async () => {
    const request = {
      Uid: "1",
      text: "testMessageText",
      userId: "1",
    };

    const expectedMessage = new Message(
      new MessageId(request.Uid),
      request.text,
      request.userId
    );

    await messageCreator.create(request);

    expect(repository.create).toBeCalledWith(expectedMessage);
  });
});