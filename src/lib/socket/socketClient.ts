import { io, Socket } from "socket.io-client";

// Define event types for better type safety (optional, adjust as needed)
interface SocketEvents {
	connect: () => void;
	disconnect: (reason: string) => void;
	connect_error: (err: Error) => void;
}

class SocketClient {
	private socket: Socket<SocketEvents, SocketEvents> | null = null;
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
		console.log("================================");
		console.log("Connecting to:", { url, path, token });
		console.log("================================");

		// If already connected, disconnect first to allow reconfiguration
		if (this.socket?.connected) {
			console.log("Already connected. Disconnecting existing socket.");
			this.disconnect();
		}

		// Create new socket instance
		this.socket = io(url, {
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
			transports: ["websocket"],
			path,
			auth: {
				token,
			},
			withCredentials: true,
		});

		// Connection event handlers
		this.socket.on("connect", () => {
			if (!this.socket) return;
			const transport = this.socket.io.engine.transport.name;
			console.log(`Connected to ${url} using ${transport}`);

			this.socket.io.engine.on("upgrade", () => {
				if (!this.socket) return;
				const upgradedTransport = this.socket.io.engine.transport.name;
				console.log(`Upgraded to ${upgradedTransport}`);
			});
		});

		this.socket.on("connect_error", (err) => {
			console.error(`Connection failed to ${url}: ${err.message}`);
		});

		this.socket.on("disconnect", (reason) => {
			console.log(`Disconnected from ${url}: ${reason}`);
		});

		return this.socket;
	}

	disconnect(): void {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
			console.log("Socket disconnected.");
		}
	}

	getSocket(): Socket<SocketEvents, SocketEvents> | null {
		return this.socket;
	}
}

export const socketClient = SocketClient.getInstance();
