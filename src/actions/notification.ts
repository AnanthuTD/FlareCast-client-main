import axiosInstance from "@/axios";

export const fetchNotifications = (
	type: string,
	page: number,
	limit: number
) => {
	return axiosInstance.get(
		`/api/notifications/?type=${type}&page=${page}&limit=${limit}`
	);
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
