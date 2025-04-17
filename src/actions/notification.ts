import axiosInstance from "@/axios";
import { apiRequest } from "@/axios/adapter";
import { Notification } from "@/types";

export const fetchNotifications = async (
	type: string,
	page: number,
	limit: number
) => {
	const result = await apiRequest<{
		message: string;
		notifications: Notification[];
		count: number;
	}>(
		axiosInstance.get(
			`/api/notifications/?type=${type}&page=${page}&limit=${limit}`
		)
	);
	return result;
};

export const markAsRead = () => {
	return axiosInstance.patch("/api/notifications/read/all");
};

export const deleteNotification = (ids: string[]) => {
	return axiosInstance.delete("/api/notification", {
		data: { ids },
	});
};

export const fetchNotificationCount = async () => {
	try {
		const { data } = (await axiosInstance.get<{ count: number }>(
			"/api/notifications/count"
		)) ?? { count: 0 };

		return data.count;
	} catch {
		return 0;
	}
};
