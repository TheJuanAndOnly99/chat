import { json, urlencoded } from "body-parser";
import cors from "cors";
import express, { Application, Request, Response, Router } from "express";
import helmet from "helmet";
import * as http from "http";
import socketIO, { Server as SocketIOServer } from 'socket.io';
import mongoose from "mongoose";


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

		const router = Router();
		this.app.use(router);
		this.registerRoutes(router, this.io);

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSockets();
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

  private initializeSockets(): void {
    this.io?.on("connection", (socket) => {
      console.log("A user connected.");

      // Handle incoming chat messages
      socket.on("chatMessage", (message) => {
        console.log("Received message:", message);

        // Broadcast the message to all connected clients (including sender)
        this.io?.emit("chatMessage", message);
      });

      // Handle user disconnection
      socket.on("disconnect", () => {
        console.log("A user disconnected.");
      });
    });
  }

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
