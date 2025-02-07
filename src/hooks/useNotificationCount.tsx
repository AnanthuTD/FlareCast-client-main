'use client'

import { fetchNotificationCount } from "@/actions/notification";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useFCM, { FCMRoles } from "./useFCM";

export function useNotificationCount(pollingInterval: number = 0) {
	const { notification } = useFCM(FCMRoles.USER);

	const {
		data: count = 0,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ["notificationCount"],
		queryFn: fetchNotificationCount,
		refetchInterval: pollingInterval > 0 ? pollingInterval : false,
	});

	// Refetch when a new notification is received
	useEffect(() => {
		if (notification) {
			refetch();
		}
	}, [notification, refetch]);

	return { count, isLoading, isError, refetch };
}
