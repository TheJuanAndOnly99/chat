import { RoomId } from './RoomId';
import { Message } from '../../../models/Messages/domain/Message';
import { User } from '../../../models/Users/domain/User';

export class Room {
  constructor(
    readonly Uid: RoomId,
    readonly name: string,
    readonly users: User[] = [],
    readonly messages: Message[] = [],
  ) {}
}
