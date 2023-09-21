import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../middleware/config';

import { UserCreator } from '../../Users/application/UserCreator';
import { UserCreatorRequest } from '../../Users/application/requests/UserCreatorRequest';
import { MongoUserRepository } from '../repositories/userRepository';
import { UserName } from '../../Users/domain/UserName';

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

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.body;

      // const user = await this.repository.findByUsername(username);

      // if (!user || user.password !== password) {
      //   // User not found or incorrect password
      //   res.status(401).json({ message: 'Authentication failed' });
      // }

      const token = jwt.sign({ username }, config.jwtSecret, { expiresIn: config.jwtExpiration });

      res.cookie('jwt', token, { httpOnly: true, secure: false, sameSite: 'lax', path: '/' });
      res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
