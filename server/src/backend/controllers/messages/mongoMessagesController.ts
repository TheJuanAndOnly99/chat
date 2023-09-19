import { Request, Response } from 'express';

import { MessageCreator } from '../../../Messages/application/MessageCreator';
import { MessageCreatorRequest } from '../../../Messages/application/requests/MessageCreatorRequest';
import { MongoMessageRepository } from '../../repositories/messages/mongoMessageRepository';

export class MongoMessageController {
  private readonly repository: MongoMessageRepository;
  private readonly creator: MessageCreator;

  constructor(repository: MongoMessageRepository, creator: MessageCreator) {
    this.repository = repository;
    this.creator = creator;
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
    const { Uid, text } = req.body as MessageCreatorRequest;

    const createdMessage = await this.creator.create({ Uid, text });

    res.status(201).send(createdMessage);
    } catch (error) {
      console.error('Error creating a message:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async findAll(_req: Request, res: Response): Promise<void> {
    const messages = await this.repository.findAll();
    res.status(200).send(messages);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const { Uid } = req.params;
    const message = await this.repository.findById(Uid);
    res.status(200).send(message);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { Uid } = req.params;
    await this.repository.delete(Uid);
    res.status(200).send();
  }
}
