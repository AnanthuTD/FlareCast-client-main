import { io, Socket } from "socket.io-client";

interface SocketEvents {
	connect: () => void;
	disconnect: (reason: string) => void;
	connect_error: (err: Error) => void;
	initial_data?: (data: any) => void;
	[key: string]: any;
}

class SocketClient {
	private sockets: Map<string, Socket<SocketEvents, SocketEvents>> = new Map();
	private static instance: SocketClient;

	private constructor() {}

	public static getInstance(): SocketClient {
		if (!SocketClient.instance) {
			SocketClient.instance = new SocketClient();
		}
		return SocketClient.instance;
	}

	connect(
		url: string,
		path: string,
		token: string
	): Socket<SocketEvents, SocketEvents> {
		const key = `${url}${path}`;

		// Return existing socket if already connected
		if (this.sockets.has(key) && this.sockets.get(key)!.connected) {
			return this.sockets.get(key)!;
		}

		const socket = io(`${url}`, {
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
			transports: ["websocket"],
			auth: { token },
			withCredentials: true,
			path,
		});

		this.sockets.set(key, socket);

		socket.on("connect", () => {
			const transport = socket.io.engine.transport.name;
			console.log(`✔️ Connected to ${key} using ${transport}`);
		});

		socket.on("connect_error", (err) => {
			console.error(`🔴 Connection failed to ${key}: ${err.message}`);
		});

		socket.on("disconnect", (reason) => {
			console.debug(`🟡 Disconnected from ${key}: ${reason}`);
		});

		return socket;
	}

	disconnect(key?: string): void {
		if (key) {
			const socket = this.sockets.get(key);
			if (socket) {
				socket.disconnect();
				this.sockets.delete(key);
			}
		} else {
			// Disconnect all
			this.sockets.forEach((socket, ns) => {
				socket.disconnect();
				this.sockets.delete(ns);
			});
		}
	}

	getSocket(key: string): Socket<SocketEvents, SocketEvents> | null {
		return this.sockets.get(key) || null;
	}
}

export const socketClient = SocketClient.getInstance();
