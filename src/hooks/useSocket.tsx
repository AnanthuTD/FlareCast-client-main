import { useEffect, useState } from "react";
import { socketClient } from "@/lib/socket/socketClient";

export const useSocket = (url: string, path: string) => {
	const key = `${url}${path}`;
	const [isConnected, setIsConnected] = useState(false);
	const [socketError, setSocketError] = useState<string | null>(null);

	// Function to extract accessToken from document.cookie
	const getAccessTokenFromCookie = () => {
		const cookies = document.cookie.split("; ");
		const accessTokenCookie = cookies.find((cookie) =>
			cookie.startsWith("accessToken=")
		);
		return accessTokenCookie ? accessTokenCookie.split("=")[1] : null;
	};

	useEffect(() => {
		const accessToken = getAccessTokenFromCookie();

		if (!url || !accessToken) {
			console.warn("Missing url or accessToken:", { url, accessToken });
			return;
		}

		const socket = socketClient.connect(url, path, accessToken);

		socket.on("connect", () => {
			setIsConnected(true);
			setSocketError(null);
			console.log("🟢 Socket connected");
		});

		socket.on("connect_error", (error) => {
			setIsConnected(false);
			setSocketError(error.message);
			console.error("🔴 Socket connect error:", error);
		});

		socket.on("disconnect", () => {
			setIsConnected(false);
			console.debug("🔴 Socket disconnected");
		});

		return () => {
			socketClient.disconnect();
		};
	}, [url, path]);

	const emitEvent = (event: string, data: any) => {
		const socket = socketClient.getSocket(key);
		if (socket) {
			socket.emit(event, data);
		}
	};

	const onEvent = (event: string, callback: (data: any) => void) => {
		const socket = socketClient.getSocket(key);
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
