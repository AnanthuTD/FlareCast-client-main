"use client";

import { useUserStore } from "@/providers/UserStoreProvider";
import Image from "next/image";
import React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axiosInstance from "@/axios";
import { useRouter } from "next/navigation";

function ProfilePicture() {
	const profilePicture = useUserStore((state) => state.image); // Replace with actual profile picture logic if available
	const firstName = useUserStore((state) => state.firstName);
	const clearAccessToken = useUserStore((state) => state.clearAccessToken);
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await axiosInstance.post("/api/users/auth/logout");
			clearAccessToken();
			router.push("/signin");
		} catch (error) {
			console.error("Logout failed", error);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{profilePicture ? (
					<Image
						loading="lazy"
						src={profilePicture}
						className="object-contain flex-1 shrink self-stretch my-auto aspect-square basis-0 cursor-pointer rounded-full"
						alt="User avatar"
						width={36}
						height={36}
					/>
				) : (
					<div className="flex justify-center items-center w-[36px] aspect-square text-sm leading-relaxed text-orange-800 whitespace-nowrap bg-red-200 rounded-full cursor-pointer">
						{firstName[0]}
					</div>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-48">
				<DropdownMenuItem onClick={handleLogout} className="text-red-600">
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default ProfilePicture;
