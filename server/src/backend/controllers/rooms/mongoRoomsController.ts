import { Request, Response } from 'express';

import { RoomCreator } from '../../../Rooms/application/RoomCreator';
import { RoomCreatorRequest } from '../../../Rooms/application/requests/RoomCreatorRequest';
import { MongoRoomRepository } from '../../repositories/rooms/mongoRoomRepository';

export class MongoRoomController {
  private readonly repository: MongoRoomRepository;
  private readonly creator: RoomCreator;

  constructor(repository: MongoRoomRepository, creator: RoomCreator) {
    this.repository = repository;
    this.creator = creator;
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
    const { Uid } = req.body as RoomCreatorRequest;
    const createdRoom = await this.creator.create({ Uid });

    res.status(201).send(createdRoom);
    } catch (error) {
      console.error('Error creating a room:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async findAll(_req: Request, res: Response): Promise<void> {
    const rooms = await this.repository.findAll();
    res.status(200).send(rooms);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const { Uid } = req.params;
    const room = await this.repository.findById(Uid);
    res.status(200).send(room);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { Uid } = req.params;
    await this.repository.delete(Uid);
    res.status(200).send();
  }

  async addUser(req: Request, res: Response): Promise<void> {
    try {
      const { roomId, userId } = req.params; // Updated parameter names
      await this.repository.addUser(roomId, userId);
      res.status(200).send('User added to room successfully.');
    } catch (error) {
      console.error('Error adding user to room:', error);
      res.status(500).send('An error occurred while adding the user to the room.');
    }
  }

  async removeUser(req: Request, res: Response): Promise<void> {
    try {
      const { roomId, userId } = req.params; // Updated parameter names
      await this.repository.removeUser(roomId, userId);
      res.status(200).send('User removed from room successfully.');
    } catch (error) {
      console.error('Error removing user from room:', error);
      res.status(500).send('An error occurred while removing the user from the room.');
    }
  }

  async addMessage(req: Request, res: Response): Promise<void> {
    try {
      const { roomId, messageId } = req.params; // Updated parameter names
      await this.repository.addMessage(roomId, messageId);
      res.status(200).send('Message added to room successfully.');
    } catch (error) {
      console.error('Error adding message to room:', error);
      res.status(500).send('An error occurred while adding the message to the room.');
    }
  }
}