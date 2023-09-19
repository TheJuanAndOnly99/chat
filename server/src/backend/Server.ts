import { json, urlencoded } from "body-parser";
import cors from "cors";
import express, { Application, Request, Response, Router } from "express";
import helmet from "helmet";
import * as http from "http";
import socketIO, { Server as SocketIOServer } from 'socket.io';
import mongoose from "mongoose";

import { MongoUserController } from "./controllers/users/mongoUserController";
import { MongoRoomController } from "./controllers/rooms/mongoRoomsController";
import { MongoMessageController } from "./controllers/messages/mongoMessagesController";
import { MongoUserRepository } from "./repositories/users/mongoUserRepository";
import { MongoRoomRepository } from "./repositories/rooms/mongoRoomRepository";
import { MongoMessageRepository } from "./repositories/messages/mongoMessageRepository";
import { UserSchema } from "./schema/mongoUserSchema";
import { RoomSchema } from "./schema/mongoRoomSchema";
import { MessageSchema } from "./schema/mongoMessageSchema";
import { UserCreator } from "../Users/application/UserCreator";
import { RoomCreator } from '../Rooms/application/RoomCreator';
import { MessageCreator } from "../Messages/application/MessageCreator";
import { User } from "../Users/domain/User";
import { Room } from "../Rooms/domain/Room";
import { Message } from '../Messages/domain/Message';

export class Server {
  private readonly app: Application;
  private httpServer?: http.Server;
  private readonly io?: SocketIOServer;

  constructor(private readonly port: string | number) {
    this.app = express();
		this.app.use(helmet());
		this.app.use(cors());
		this.app.use(json());
		this.app.use(urlencoded({ extended: true }));
    this.httpServer = http.createServer(this.app);
    this.io = new socketIO.Server(this.httpServer);
    this.port = process.env.PORT || 3000;

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
		router.post('/users', userController.create.bind(userController));
    router.get('/users', userController.findAll.bind(userController));
    router.get('/users/:Uid', userController.findById.bind(userController));
    router.delete('/users/:Uid', userController.delete.bind(userController));
    router.get('/user/:Username', userController.findByUsername.bind(userController));

    router.get('/rooms', roomController.findAll.bind(roomController));
    router.get('/rooms/:Uid', roomController.findById.bind(roomController));
    router.post('/rooms', roomController.create.bind(roomController));
    router.delete('/rooms/:Uid', roomController.delete.bind(roomController));
    router.post('/rooms/:roomId/user/:userId', roomController.addUser.bind(roomController));
    router.delete('/rooms/:roomId/:userId', roomController.removeUser.bind(roomController));
    router.post('/rooms/:roomId/message/:messageId', roomController.addMessage.bind(roomController));

    router.get('/messages', messageController.findAll.bind(messageController));
    router.get('/messages/:Uid', messageController.findById.bind(messageController));
    router.post('/messages', messageController.create.bind(messageController));
    router.delete('/messages/:Uid', messageController.delete.bind(messageController));
		this.app.use(router);

		this.registerRoutes(router, this.io);
    this.initializeMiddlewares();
    this.initializeRoutes();
    // this.initializeSockets();
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

  // private initializeSockets(): void {
  //   this.io?.on("connection", (socket) => {
  //     console.log("A user connected.");

  //     // Handle incoming chat messages
  //     socket.on("chatMessage", (message) => {
  //       console.log("Received message:", message);

  //       // Broadcast the message to all connected clients (including sender)
  //       this.io?.emit("chatMessage", message);
  //     });

  //     // Handle user disconnection
  //     socket.on("disconnect", () => {
  //       console.log("A user disconnected.");
  //     });
  //   });
  // }

  private connectToDatabase(): void {
		mongoose
			.connect('mongodb://localhost:27017/chat-app')
			.then(() => {
				console.log('Connected to MongoDB');
			})
			.catch((err) => {
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
