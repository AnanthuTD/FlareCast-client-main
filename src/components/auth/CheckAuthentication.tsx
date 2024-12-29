"use client";

import axiosInstance from "@/axios";
import { useUserStore } from "@/providers/UserStoreProvider";
import { useRouter } from "next/navigation";
import React, { useLayoutEffect } from "react";

function CheckAuthentication({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const setUser = useUserStore((state) => state.setUser);

	useLayoutEffect(() => {
		async function checkAuthorizedUser() {
			try {
				const { data } = await axiosInstance.get(
					"/api/auth/check-authentication"
				);

				if (data.user) setUser(data.user);
			} catch (error) {
				console.error("Error checking authentication:", error);
			}
		}

		checkAuthorizedUser();
	}, [setUser, router]);

	return <>{children}</>;
}

export default CheckAuthentication;
