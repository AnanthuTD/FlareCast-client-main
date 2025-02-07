'use client'

import * as React from "react";
import { ModeToggle } from "../ModeToggle";
import Sidebar from "./Sidebar";
import ProfilePicture from "./ProfilePicture";
import { useNotificationCount } from "@/hooks/useNotificationCount"; // Import the custom hook
import {
	Bell,
	Bookmark,
	History,
	House,
	Library,
	Settings,
} from "lucide-react";

const workspaces = [
	/* {
		name: "All Moksh's Workspace",
		memberCount: 1,
		avatarLabel: "A",
		id: "workspace_id",
	}, */
];

export const UserLayout: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { count: notificationCount } = useNotificationCount(0); // Fetch notification count with polling every 5 sec

	// Dynamically update sidebar items with the latest notification count
	const sidebarItems = React.useMemo(
		() => [
			{
				icon: <House />,
				label: "Home",
				isActive: false,
				link: "/home",
				notificationCount: 0,
			},
			{
				icon: <Library />,
				label: "My Library",
				link: "/library",
				notificationCount: 0,
			},
			{
				icon: <Bell />,
				label: "Notifications",
				notificationCount, // Update notification count here
				link: "/notifications",
			},
			{
				icon: <Bookmark />,
				label: "Watch Later",
				notificationCount: 1,
				link: "/watchLater",
			},
			{
				icon: <History />,
				label: "History",
				notificationCount: 0,
				link: "/history",
			},
			{
				icon: <Settings />,
				label: "Settings",
				notificationCount: 0,
				link: "/settings",
			},
		],
		[notificationCount]
	);

	return (
		<div className="flex overflow-hidden flex-col bg-white">
			<div className="flex flex-wrap items-start w-full max-md:max-w-full">
				{/* sidebar */}
				<Sidebar
					workspaces={workspaces}
					sidebarItems={sidebarItems}
					activeWorkspaceId=""
				/>

				<main className="flex flex-col flex-1 shrink bg-white basis-0 min-w-[240px] max-md:max-w-full">
					<header className="flex overflow-hidden gap-10 justify-between items-center px-4 py-3.5 w-full max-md:max-w-full">
						<form className="flex flex-wrap gap-5 self-stretch px-11 py-4 my-auto tracking-normal min-w-[240px] w-[1120px] max-md:px-5 max-md:max-w-full">
							<div className="flex overflow-hidden flex-auto gap-2 px-3 py-1.5 text-sm leading-relaxed bg-white rounded-2xl text-neutral-800">
								<img
									loading="lazy"
									src="https://cdn.builder.io/api/v1/image/assets/TEMP/f2d9385bb5df7f5aadb776322cbe0dde2f790cab694baf7fe9fdf4cc49364436?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
									className="object-contain shrink-0 w-6 aspect-square"
									alt="Search icon"
								/>
								<label htmlFor="search" className="sr-only">
									Search
								</label>
								<input
									id="search"
									type="search"
									className="flex-auto my-auto max-md:max-w-full border-none bg-transparent focus:outline-none"
									placeholder="Search for people, tags, folders, Spaces, and Looms"
								/>
							</div>
							<div className="flex gap-2.5 text-sm text-center">
								<div className="grow my-auto leading-loose text-gray-500">
									1/25 videos
								</div>
								<button className="flex gap-2 items-start py-1.5 pr-5 pl-4 font-medium leading-6 text-white whitespace-nowrap bg-indigo-500 rounded-[7992px]">
									<img
										loading="lazy"
										src="https://cdn.builder.io/api/v1/image/assets/TEMP/0e98f57b5983542cc4f8759477d375d09833e89f4ddd93c2f875b6abb97f1583?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
										className="object-contain shrink-0 w-4 aspect-[0.67]"
										alt=""
									/>
									<div>Upgrade</div>
								</button>
							</div>
						</form>

						{/* Toggle theme */}
						<ModeToggle />

						<div className="flex overflow-hidden gap-2.5 items-center self-stretch my-auto w-9 h-9 bg-white rounded-[7992px]">
							<ProfilePicture />
						</div>
					</header>

					<div className="flex overflow-hidden flex-col items-center pt-10 px-10 w-full min-h-[952px] max-md:max-w-full">
						{/* Render pages */}
						{children}
					</div>
				</main>
			</div>
		</div>
	);
};
