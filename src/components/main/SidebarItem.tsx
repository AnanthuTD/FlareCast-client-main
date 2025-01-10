"use client";

import React, { useState } from "react";
import { SidebarItemProps } from "@/types";
import { usePathname, useRouter } from "next/navigation";

export const SidebarItem: React.FC<SidebarItemProps> = ({
	icon,
	label,
	isActive,
	notificationCount,
	link,
}) => {
	const router = useRouter();
	const pathName = usePathname();
	const [isHovered, setIsHovered] = useState(false);

	const extendedClass =
		" text-indigo-500 bg-indigo-500 bg-opacity-10 max-w-[221px] rounded-[7992px]";
	const baseClasses =
		"font-bold py-1.5 pl-3 pr-2 text-black flex justify-between items-center text-sm leading-6 w-full";
	const activeClasses = isActive || pathName === link ? extendedClass : "";

	const handleNavigation = () => {
		router.push(link);
	};

	return (
		<button
			className={`${baseClasses} ${activeClasses} ${
				isHovered ? extendedClass : ""
			}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={handleNavigation}
		>
			<div className="flex gap-2 items-start">
				{/* <img
					loading="lazy"
					src={icon}
					className="object-contain shrink-0 w-6 aspect-square"
					alt=""
				/> */}
				{icon}
				<div className="overflow-hidden pr-1">{label}</div>
			</div>
			{notificationCount !== undefined && (
				<div
					className={`flex overflow-hidden flex-col items-center justify-center w-5 h-5 text-sm leading-relaxed rounded-3xl ${
						notificationCount > 0 ? "bg-red-500" : "bg-gray-700 bg-opacity-0"
					}`}
				>
					<span className="text-xs text-white font-normal w-fit h-fit">
						{notificationCount}
					</span>
				</div>
			)}
		</button>
	);
};
