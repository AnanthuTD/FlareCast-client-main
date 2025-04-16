import axiosInstance from "@/axios";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { NotificationSwitch } from "./NotificationSwitch";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PreferencesList = [
	{
		label: "My videos are first viewed",
		id: "firstViewNotifications",
	},
	{
		label: "Comments and replies on my videos",
		id: "commentNotifications",
	},
	{
		label: "Transcript regeneration completes successfully",
		id: "transcriptSuccessNotifications",
	},
	{
		label: "Transcript regeneration fails",
		id: "transcriptFailureNotifications",
	},
	{
		label: "Someone shares a video with me",
		id: "shareNotifications",
	},
	{
		label: "Admin removes you from or deletes a Space",
		id: "removeFromWorkspaceNotification",
	},
];

interface NotificationPreferences {
	[key: string]: {
		push: boolean;
		email: boolean;
	};
}

export function NotificationPreferenceTable() {
	const [preferences, setPreferences] = useState<NotificationPreferences>(null);

	const fetchPreferences = async () => {
		try {
			const response = await axiosInstance.get("/api/notifications/preferences");
			setPreferences(response.data);
		} catch (error) {
			console.error(error);
			toast.error(error?.message || "Failed to get notification preferences");
		}
	};

	useEffect(() => {
		fetchPreferences();
	}, []);

	const updateNotificationPreference = async (
		checked: boolean,
		preferenceId: string,
		type: string
	) => {
		try {
			const response = await axiosInstance.patch(
				"/api/notifications/preference",
				{
					checked,
					preferenceId,
					type,
				}
			);
			/* 
			if (response.status === 200) {
				// Update the preferences state
				setPreferences((prev) => ({
					...prev,
					[preferenceId]: {
						...prev[preferenceId],
						[type]: checked,
					},
				}));
			} */

			return response;
		} catch (error) {
			console.error(error);
			toast.error("Failed to update notification preference");
			throw error; // Re-throw the error to handle it in the NotificationSwitch component
		}
	};

	return (
		<Table>
			<TableCaption>Notification Preferences.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className="w-2/5 text-black text-2xl font-semibold leading-none">
						Notify me when...
					</TableHead>
					<TableHead className="text-black text-2xl font-semibold leading-none">
						Email
					</TableHead>
					<TableHead className="text-black text-2xl font-semibold leading-none">
						Push Notification
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{preferences && PreferencesList.map((preference) => (
					<TableRow key={preference.id}>
						<TableCell className="font-medium py-5">
							{preference.label}
						</TableCell>
						<TableCell className="py-5">
							<NotificationSwitch
								checked={preferences[preference.id]?.email ?? false}
								preferenceId={preference.id}
								type="email"
								updateNotificationPreference={updateNotificationPreference}
							/>
						</TableCell>
						<TableCell className="py-5">
							<NotificationSwitch
								checked={preferences[preference.id]?.push ?? false}
								preferenceId={preference.id}
								type="push"
								updateNotificationPreference={updateNotificationPreference}
							/>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
