import { useEffect, useState } from "react";

export function useSSE<T>(url: string, dependencies: any[] = []) {
	const [messages, setMessages] = useState<T[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!url) return;

		const eventSource = new EventSource(url, { withCredentials: true });
		console.log("📡 New SSE event received");

		eventSource.onmessage = (event) => {
			try {
				const data: T = JSON.parse(event.data);
				console.log("Event data: ", data);
				setMessages((prev) => [...prev, data]);
			} catch (err) {
				console.error("🔴 Error parsing SSE data:", err);
				setError("Failed to parse SSE data");
			}
		};

		eventSource.onerror = (err) => {
			console.error("🔴 SSE connection error:", err);
			setError("SSE connection lost");
			eventSource.close();
		};

		return () => {
			console.log("🔌 Closing SSE connection");
			eventSource.close();
		};
	}, [...dependencies, url]);

	return { messages, error, setMessages };
}
