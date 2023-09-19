import { RoomId } from './RoomId';
import { Message } from '../../Messages/domain/Message';
import { User } from '../../Users/domain/User';

export class Room {
  constructor(
    readonly Uid: RoomId,
    readonly users: User[] = [],
    readonly messages: Message[] = [],
  ) {}
}
