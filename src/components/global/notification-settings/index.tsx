"use client";

import { TabsContent } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { NotificationBanner } from "./NotificationBanner";
import { NotificationPreferenceTable } from "./NotificationPreference";

const NotificationSettings = () => {
	const [notificationPermission, setNotificationPermission] =
		useState<NotificationPermission>("granted");

	useEffect(() => {
		if (typeof Notification !== "undefined") {
			setNotificationPermission(Notification.permission);
		}
	}, []);

	return (
		<TabsContent value="Notification" className="">
			<div className="flex flex-col gap-y-10 mt-10">
				{notificationPermission !== "granted" && (
					<NotificationBanner
						title="You need to allow permission for push notifications"
						description="Know when your video has been watched and interacted with."
					/>
				)}

				<NotificationPreferenceTable />
			</div>
		</TabsContent>
	);
};

export default NotificationSettings;
