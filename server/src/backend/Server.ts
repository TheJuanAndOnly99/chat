import { json, urlencoded } from "body-parser";
import cors from "cors";
import express, { Application, Request, Response, Router } from "express";
import helmet from "helmet";
import * as http from "http";
import { Server as SocketIOServer } from 'socket.io';
import mongoose from "mongoose";
import authenticateToken from "./middleware/authMiddleware";
import cookieParser from "cookie-parser";
import 'dotenv/config'

import { MongoUserController } from "./controllers/userController";
import { MongoRoomController } from "./controllers/roomsController";
import { MongoMessageController } from "./controllers/messagesController";
import { MongoUserRepository } from "./repositories/userRepository";
import { MongoRoomRepository } from "./repositories/roomRepository";
import { MongoMessageRepository } from "./repositories/messageRepository";
import { UserSchema } from "./schema/userSchema";
import { RoomSchema } from "./schema/roomSchema";
import { MessageSchema } from "./schema/messageSchema";
import { UserCreator } from "../Users/application/UserCreator";
import { RoomCreator } from '../Rooms/application/RoomCreator';
import { MessageCreator } from "../Messages/application/MessageCreator";
import { User } from "../Users/domain/User";
import { Room } from "../Rooms/domain/Room";
import { Message } from '../Messages/domain/Message';

const clientUrl = process.env.CLIENT_URL;

export class Server {
  private readonly app: Application;
  private httpServer?: http.Server;
  private readonly io?: SocketIOServer;

  constructor(private readonly port: string | number) {
    this.app = express();
    this.app.use(cookieParser());
		this.app.use(helmet());
		this.app.use(cors({ credentials: true, origin: clientUrl }));
		this.app.use(json());
		this.app.use(urlencoded({ extended: true }));
    this.httpServer = http.createServer(this.app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: clientUrl, // Specify your frontend's origin here
        methods: ["GET", "POST"],
        credentials: true
      }
    });
    this.port = 3000;

    // Handle Socket.IO connections
    this.io?.on('connection', (socket) => {
      console.log('A user connected.');

      socket.on('chatMessage', (message) => {
        console.log(`Received message: ${message}`);
        this.io?.emit('chatMessage', message); // Broadcast the message to all clients
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected.');
      });
    });

		const userModel = mongoose.model<User>('User', UserSchema);
    const roomModel = mongoose.model<Room>('Room', RoomSchema);
    const messageModel = mongoose.model<Message>('Message', MessageSchema);

		const userRepository = new MongoUserRepository(userModel);
    const roomRepository = new MongoRoomRepository(roomModel);
    const messageRepository = new MongoMessageRepository(messageModel);

		const userCreator = new UserCreator(userRepository);
    const roomCreator = new RoomCreator(roomRepository);
    const messageCreator = new MessageCreator(messageRepository);

		const userController = new MongoUserController(userRepository, userCreator);
    const roomController = new MongoRoomController(roomRepository, roomCreator);
    const messageController = new MongoMessageController(messageRepository, messageCreator);

		const router = Router();
    router.post('/login', userController.login.bind(userController));

		router.post('/users', userController.create.bind(userController));
    router.get('/users', userController.findAll.bind(userController));
    router.get('/users/:Uid', userController.findById.bind(userController));
    router.delete('/users/:Uid', userController.delete.bind(userController));
    router.get('/user/:Username', userController.findByUsername.bind(userController));

    router.get('/rooms', roomController.findAll.bind(roomController));
    router.get('/rooms/:Uid', roomController.findById.bind(roomController));
    router.get('/room/:Name', roomController.findByName.bind(roomController));
    router.post('/rooms', authenticateToken, roomController.create.bind(roomController));
    router.delete('/rooms/:Uid', roomController.delete.bind(roomController));
    router.post('/rooms/:roomId/user/:userId', roomController.addUser.bind(roomController));
    router.delete('/rooms/:roomId/user/:userId', roomController.removeUser.bind(roomController));
    router.post('/rooms/:roomId/message/:messageId', roomController.addMessage.bind(roomController));
    router.get('/room/:roomId/messages', roomController.getAllMessages.bind(roomController));

    router.get('/messages', messageController.findAll.bind(messageController));
    router.get('/messages/:Uid', messageController.findById.bind(messageController));
    // router.post('/messages', messageController.create.bind(messageController));
    router.delete('/messages/:Uid', messageController.delete.bind(messageController));
    router.post('/messages', async (req: Request, res: Response) => {
      try {
        // Create a new message
        const newMessage = await messageController.create(req, res);
    
        // Emit the new message to all connected clients
        this.io?.emit('chatMessage', newMessage);
    
        res.status(201).send(newMessage);
      } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    this.app.use(router);
		this.registerRoutes(router, this.io);
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.connectToDatabase();
  }

  private initializeMiddlewares(): void {
    // Add any global middlewares here if needed
  }

	private registerRoutes(_router: Router, _io: SocketIOServer): void {
		// Register routes here
	}

  private initializeRoutes(): void {
    // Define a basic route for testing
    this.app.get('/', (_req: Request, res: Response) => {
      res.send('Hello, this is the chat application!');
    });
  }

    private connectToDatabase(): void {
      mongoose
        .connect('mongodb://localhost:27017/chat-app')
        .then(() => {
          console.log('Connected to MongoDB');
        })
        .catch((err: Error) => {
          console.error('Error connecting to MongoDB:', err);
        });
    }

  public startServer(): void {
    this.httpServer?.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

	getHTTPServer(): Server["httpServer"] {
		return this.httpServer;
	}

	async stop(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.httpServer) {
				this.httpServer.close((error) => {
					if (error) {
						reject(error);

						return;
					}

					resolve();
				});
			}
		});
	}
}
