import axiosInstance from "@/axios";

export const fetchNotifications = (
	type: string,
	page: number,
	limit: number
) => {
	return axiosInstance.get(
		`/api/notification/?type=${type}&page=${page}&limit=${limit}`
	);
};

export const markAsRead = () => {
	return axiosInstance.patch("/api/notification/read/all");
};

export const deleteNotification = (ids: string[]) => {
	return axiosInstance.delete("/api/notification", {
		data: { ids },
	});
};
