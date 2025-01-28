import NotificationSettings from "@/components/global/notification-settings";
import PersonalSettings from "@/components/global/personal-settings";
import TabMenu from "@/components/global/tabs";
import WorkspaceSettings from "@/components/global/workspace-settings";
import React from "react";

function SettingsPage() {
	return (
		<div className="flex flex-col items-start w-full text-2xl gap-3">
			<h1>Settings</h1>

			<TabMenu
				defaultValue="Notification"
				triggers={["Personal", "Notification", "Workspace"]}
			>
				<PersonalSettings />
				<NotificationSettings />
				<WorkspaceSettings />
			</TabMenu>
		</div>
	);
}

export default SettingsPage;
