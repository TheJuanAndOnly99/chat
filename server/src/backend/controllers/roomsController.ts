import { Request, Response } from 'express';

import { RoomCreator } from '../../Rooms/application/RoomCreator';
import { RoomCreatorRequest } from '../../Rooms/application/requests/RoomCreatorRequest';
import { MongoRoomRepository } from '../repositories/roomRepository';

export class MongoRoomController {
  private readonly repository: MongoRoomRepository;
  private readonly creator: RoomCreator;

  constructor(repository: MongoRoomRepository, creator: RoomCreator) {
    this.repository = repository;
    this.creator = creator;
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
    const { Uid, name } = req.body as RoomCreatorRequest;
    const createdRoom = await this.creator.create({ Uid, name });

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

  async findByName(req: Request, res: Response): Promise<void> {
    try {
      const { Name } = req.params; // Use the parameter name defined in the route
      const room = await this.repository.findByName(Name); // Use Name to search for the room
      if (room) {
        res.status(200).send(room);
      } else {
        res.status(404).send({ message: 'Room not found' });
      }
    } catch (error) {
      console.error('Error finding room by name:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
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

  async getAllMessages(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params; // Updated parameter names
    const messages = await this.repository.getAllMessages(roomId);
    res.status(200).send(messages);
  }
}
