"use client";

import { useEffect, useState } from "react";

export default function SSEComponent() {
	const [messages, setMessages] = useState<string[]>([]);

	useEffect(() => {
		const eventSource = new EventSource("api/video/events", {
			withCredentials: true,
		});
		/* const eventSource = new EventSource("http://localhost:4000/events", {
			withCredentials: true, // ✅ Include credentials for CORS
		}); */

		eventSource.onmessage = (event) => {
			console.log("📡 New SSE Event:", event);
			const data = JSON.parse(event.data);
			setMessages((prev) => [...prev, `${data.message} at ${data.time}`]);
		};

		eventSource.onerror = (error) => {
			console.error("🔴 SSE connection error, closing...", error);
			eventSource.close();
		};

		return () => {
			console.log("🔌 Closing SSE connection");
			eventSource.close();
		};
	}, []);

	return (
		<div>
			<h2>📡 SSE Test</h2>
			<ul>
				{messages.map((msg, index) => (
					<li key={index}>{msg}</li>
				))}
			</ul>
		</div>
	);
}
