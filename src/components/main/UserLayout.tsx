"use client";

import * as React from "react";
import Sidebar from "./Sidebar";
import ProfilePicture from "./ProfilePicture";
import { useNotificationCount } from "@/hooks/useNotificationCount";
import {
	Bell,
	Bookmark,
	House,
	Library,
	Settings,
	ZapIcon,
} from "lucide-react";
import { VideoSearchUI } from "../global/video-search";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import Link from "next/link";
import { useSocket } from "@/hooks/useSocket";
import useVideoLimit from "@/hooks/useVideoLimit";
import { SidebarProvider } from "../ui/sidebar";

export const UserLayout: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	// to track active users
	const {} = useSocket(
		`${process.env.NEXT_PUBLIC_BACKEND_URL}/user` as string,
		"/users/socket.io"
	);
	const activeWorkspaceId = useWorkspaceStore(
		(state) => state.selectedWorkspace.id
	);
	const { count: notificationCount } = useNotificationCount(0);
	const { data } = useVideoLimit();

	const sidebarItems = React.useMemo(
		() => [
			{
				icon: House,
				label: "Home",
				isActive: false,
				link: "/home",
				notificationCount: 0,
				items: [],
			},
			{
				icon: Library,
				label: "My Library",
				link: "/library",
				notificationCount: 0,
			},
			{
				icon: Bell,
				label: "Notifications",
				notificationCount,
				link: "/notifications",
			},
			{
				icon: Bookmark,
				label: "Watch Later",
				notificationCount: 0,
				link: "/watchlater",
			},
			{
				icon: Settings,
				label: "Settings",
				notificationCount: 0,
				link: "/settings",
			},
		],
		[notificationCount]
	);

	return (
		// <SidebarProvider>
			<div className="flex h-screen bg-white">
				{/* Fixed Sidebar */}
				<div className="fixed top-0 left-0 h-full w-64 bg-white z-10">
					<Sidebar
						workspaces={[]}
						sidebarItems={sidebarItems}
						activeWorkspaceId={activeWorkspaceId}
					/>
					{/* <AppSidebar data={{ navMain: sidebarItems }} /> */}
				</div>

				{/* Main Content Area */}
				<div className="flex-1 flex flex-col pl-64 h-full w-full">
					{/* Fixed Header */}
					<header className="fixed top-0 left-64 right-0 flex gap-10 justify-between items-center px-4 py-3.5 bg-white z-10">
						<form className="flex flex-wrap gap-5 self-stretch px-11 py-4 my-auto tracking-normal min-w-[240px] w-[1120px] max-md:px-5 max-md:max-w-full">
							<div className="grow">
								<VideoSearchUI workspaceId={activeWorkspaceId} />
							</div>
							<div className="flex gap-2.5 text-sm text-center items-center">
								<div className="grow my-auto leading-loose text-gray-500">
									{data?.totalVideoUploaded} /{" "}
									{data?.maxVideoCount ?? "unlimited"} videos
								</div>
								<Link href={"/upgrade"}>
									<button className="flex gap-2 items-start py-1.5 pr-5 pl-4 font-medium leading-6 text-white whitespace-nowrap bg-indigo-500 rounded-[7992px]">
										<ZapIcon fill="white" color="transparent" />
										<div>Upgrade</div>
									</button>
								</Link>
							</div>
						</form>
						{/* <ModeToggle /> */}
						<div className="flex overflow-hidden gap-2.5 items-center self-stretch my-auto w-9 h-9 bg-white rounded-[7992px]">
							<ProfilePicture />
						</div>
					</header>

					{/* Scrollable Children Content */}
					<main className="flex-1 overflow-y-auto pt-28 px-10 bg-white">
						<div className="flex flex-col items-center w-full min-h-[calc(100vh-5rem)]">
							{children}
						</div>
					</main>
				</div>
			</div>
		// </SidebarProvider>
	);
};
