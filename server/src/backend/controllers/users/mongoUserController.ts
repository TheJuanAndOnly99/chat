import { Request, Response } from 'express';

import { UserCreator } from '../../../Users/application/UserCreator';
import { UserCreatorRequest } from '../../../Users/application/requests/UserCreatorRequest';
import { MongoUserRepository } from '../../repositories/users/mongoUserRepository';
import { UserName } from '../../../Users/domain/UserName';

export class MongoUserController {
  private readonly repository: MongoUserRepository;
  private readonly creator: UserCreator;

  constructor(repository: MongoUserRepository, creator: UserCreator) {
    this.repository = repository;
    this.creator = creator;
  }

  async create(req: Request, res: Response): Promise<void> {
    const { Uid, username, email, password } = req.body as UserCreatorRequest;
    await this.creator.create({ Uid, username, email, password });
    res.status(201).send();
  }

  async findAll(_req: Request, res: Response): Promise<void> {
    const users = await this.repository.findAll();
    res.status(200).send(users);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const { Uid } = req.params;
    const user = await this.repository.findById(Uid);
    res.status(200).send(user);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { Uid } = req.params;
    await this.repository.delete(Uid);
    res.status(200).send();
  }

  async findByUsername(req: Request, res: Response): Promise<void> {
    const { Username } = req.params;
    const username = new UserName(Username); // Create a UserName instance
    const user = await this.repository.findByUsername(username);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  }
}
