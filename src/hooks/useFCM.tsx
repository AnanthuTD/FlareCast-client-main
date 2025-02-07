import { useEffect, useState } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebaseConfig";
import { toast } from "sonner";

export enum FCMRoles {
	ADMIN = "admin",
	USER = "user",
}

interface FCMMessagePayload {
	title: string;
	body: string;
	role: FCMRoles;
}

const useFCM = (role: FCMRoles) => {
	const [message, setMessage] = useState();
	const [notification, setNotification] = useState(null);

	useEffect(() => {
		const unsubscribe = onMessage(messaging, (payload) => {
			// toast.info("hi");
			console.log("Message received. hook ", payload);

			if (payload.data && payload.data.notification) {
				setNotification(JSON.parse(payload.data?.notification));
			}

			const {
				title,
				body,
				role: messageRole,
			} = payload.notification as unknown as FCMMessagePayload; // or payload.data

			// Check if the role in the payload matches the current user's role
			// if (messageRole !== role) return;

			setMessage(payload.notification);

			handleForegroundMessage({ title, body, role: messageRole });
		});

		return () => {
			unsubscribe();
		};
	}, [role]);

	return { message, notification };
};

const handleForegroundMessage = (payload: FCMMessagePayload) => {
	const { title, body } = payload;

	toast.info(title, {
		description: (
			<div>
				<p>{body}</p>
			</div>
		),
		position: "top-right",
	});
};

export default useFCM;
