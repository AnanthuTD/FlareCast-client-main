import { useEffect, useState } from "react";
import { socketClient } from "@/lib/socket/socketClient";
import { SocketEvents } from "@/lib/socket/socketEvents";
import { useUserStore } from "@/providers/UserStoreProvider";

export const useSocket = (url: string, path: string) => {
	const [isConnected, setIsConnected] = useState(false);
	const [socketError, setSocketError] = useState<string | null>(null);
	const accessToken = useUserStore((state) => state.accessToken);

	useEffect(() => {
		const socket = socketClient.connect(url, path, accessToken);

		socket.on("connect", () => {
			setIsConnected(true);
			setSocketError(null);
		});

		socket.on("connect_error", (error) => {
			setIsConnected(false);
			setSocketError(error.message);
		});

		socket.on("disconnect", () => {
			setIsConnected(false);
		});

		return () => {
			socketClient.disconnect();
		};
	}, [url, path, accessToken]);

	const emitEvent = (event: string, data: any) => {
		const socket = socketClient.getSocket();
		if (socket) {
			socket.emit(event, data);
		}
	};

	const onEvent = (event: string, callback: (data: any) => void) => {
		const socket = socketClient.getSocket();
		if (socket) {
			socket.on(event, callback);
		}
		return () => {
			if (socket) {
				socket.off(event, callback);
			}
		};
	};

	return {
		isConnected,
		socketError,
		emitEvent,
		onEvent,
	};
};
