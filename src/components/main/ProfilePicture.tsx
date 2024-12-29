'use client'

import { useUserStore } from "@/providers/UserStoreProvider";
import Image from "next/image";
import React from "react";

function ProfilePicture() {
	const profilePicture = null;
	const firstName = useUserStore((state) => state.firstName);

	return (
		<>
			{profilePicture ? (
				<Image
					loading="lazy"
					src={profilePicture}
					className="object-contain flex-1 shrink self-stretch my-auto w-9 aspect-square basis-0"
					alt="User avatar"
					width={36}
					height={36}
				/>
			) : (
				<div className="flex justify-center items-center w-[36px] aspect-square text-sm leading-relaxed text-orange-800 whitespace-nowrap bg-red-200 rounded-full">
					{firstName[0]}
				</div>
			)}
		</>
	);
}

export default ProfilePicture;
