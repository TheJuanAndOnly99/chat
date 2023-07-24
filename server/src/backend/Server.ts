import { json, urlencoded } from "body-parser";
import cors from "cors";
import express, { Request, Response, Router } from "express";
import helmet from "helmet";
import * as http from "http";
import { Server as SocketIoServer } from "socket.io";

import { HttpResponse } from "../Utilities/HttpResponse";
import socketManager from "./controllers/socketManager";
import { registerRoutes } from "./routes";

export class Server {
	private readonly express: express.Express;
	private httpServer?: http.Server;
	private readonly io?: SocketIoServer;

	constructor(private readonly port: string, private readonly frontUrl: string) {
		this.express = express();
		this.express.use(helmet());
		this.express.use(cors());
		this.express.use(json());
		this.express.use(urlencoded({ extended: true }));
		this.initializeSocketIo();
		const router = Router();
		this.express.use(router);
		registerRoutes(router, this.io);
		router.use((err: Error, _req: Request, res: Response, _next: () => void) => {
			console.log(err);
			new HttpResponse().Error(res, "Contact to an admin");
		});
		this.express.use((err: Error, _req: Request, res: Response, _next: () => void) => {
			console.log(err);
			new HttpResponse().Error(res, "Server error");
		});
	}

	getIo(): SocketIoServer | undefined {
		return this.io;
	}

	async listen(): Promise<void> {
		await new Promise<void>((resolve) => {
			this.httpServer!.listen(this.port, () => {
				console.log(
					`✅ Backend App is running at http://localhost:${this.port} in ${this.express.get(
						"env"
					)} mode`
				);

				console.log("✋ Press CTRL-C to stop\n");

				resolve();
			});
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

	private initializeSocketIo(): void {
		this.httpServer = http.createServer(this.express);
		socketManager(this.httpServer, this.frontUrl);
	}
}