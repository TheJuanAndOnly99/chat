import "dotenv/config";

import { Server } from "./Server";

// The App class is responsible for starting the server and stopping it.
export class App {
	server?: Server;

	async start(): Promise<void> {
		const port = process.env.PORT ?? "8000";
		this.server = new Server(port);

		await this.server.startServer();
	}

	get httpServer(): Server["httpServer"] | undefined {
		return this.server?.getHTTPServer();
	}

	async stop(): Promise<void> {
		return await this.server?.stop();
	}
}