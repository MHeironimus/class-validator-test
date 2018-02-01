import * as http from "http";
import * as dotenv from "dotenv";
import { App } from "./app";
import { log } from "./log";

// This loads the .env configuration.
dotenv.config();

const app: App = new App();
const defaultPort: string = "5002";
const port: number | string | boolean = normalizePort(process.env.PORT);

/**
 * Create HTTP server.
 */
export let server: http.Server = http.createServer(app.express);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string = defaultPort): number | string | boolean {
	const normalizedVal: number = parseInt(val);

	if (isNaN(normalizedVal)) {
		// named pipe
		return val;
	}

	if (normalizedVal >= 0) {
		// port number
		return normalizedVal;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: NodeJS.ErrnoException): void {
	if (error.syscall !== "listen") {
		throw error;
	}

	const bind: string = typeof port === "string"
		? `Pipe ${port}`
		: `Port ${port}`;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case "EACCES":
			log.error(`${bind} requires elevated privileges`);
			process.exit(1);
			break;
		case "EADDRINUSE":
			log.error(`${bind} is already in use`);
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
	const bind: string = `port ${server.address().port}`;
	const env: string | undefined = process.env.NODE_ENV;
	log.info(`Listening on ${bind} in ${env}`);
}
