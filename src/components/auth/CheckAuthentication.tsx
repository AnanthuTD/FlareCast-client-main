"use client";

import axiosInstance from "@/axios";
import { useUserStore } from "@/providers/UserStoreProvider";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const excludeFromAuth = [
	"/verification/email/success",
	"/verification/email/failure",
	"/verification/email/notify",
	"/verification/invitation",
	"/",
];

const routesNotPermittedForAuthUsers = ["/signin", "/signup"];

function CheckAuthentication({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();
	const setUser = useUserStore((state) => state.setUser);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function checkAuthorizedUser() {
			try {
				const { data } = await axiosInstance.get("/api/users/profile");

				if (data.user) {
					setUser(data.user);
					if (!excludeFromAuth.includes(pathName)) {
						if (!searchParams.get("callbackUrl")) {
							if (routesNotPermittedForAuthUsers.includes(pathName))
								router.replace("/home");
						}
					}
				}
			} catch (error) {
				console.error("Error checking authentication:", error);
			} finally {
				setIsLoading(false);
			}
		}

		checkAuthorizedUser();
	}, [setUser, router, pathName, searchParams]);

	if (isLoading) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<p>Loading...</p>
			</div>
		);
	}

	return <>{children}</>;
}

export default CheckAuthentication;
