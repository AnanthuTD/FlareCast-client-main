import { Switch } from "@/components/ui/switch";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { toast } from "sonner";

interface NotificationSwitchProps {
	checked: boolean;
	preferenceId: string;
	type: string;
	updateNotificationPreference: (
		checked: boolean,
		preferenceId: string,
		type: string
	) => Promise<AxiosResponse>;
}

export function NotificationSwitch({
	checked,
	preferenceId,
	type,
	updateNotificationPreference,
}: NotificationSwitchProps) {
	const [isChecked, setIsChecked] = useState(checked);

	const handleCheckedChange = async (checked: boolean) => {
		const previousState = isChecked;
		setIsChecked(checked);

		try {
			await updateNotificationPreference(checked, preferenceId, type);
		} catch (error) {
			setIsChecked(previousState); // Revert to the previous state on error
			toast.error(
				"Failed to update notification preference. Please try again."
			);
		}
	};

	return <Switch checked={isChecked} onCheckedChange={handleCheckedChange} />;
}
