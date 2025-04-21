"use client";

import * as React from "react";
import { NavMain } from "@/components/global/nav-main";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "../global/nav-user";
import { LucideIcon } from "lucide-react";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import Image from "next/image";

interface SidebarData {
	navMain: {
		label: string;
		link: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
		notificationCount: number;
	}[];
}

export function AppSidebar({
	data,
	sidebarProps,
}: {
	data: SidebarData;
	sidebarProps?: React.ComponentProps<typeof Sidebar>;
}) {
	return (
		<Sidebar collapsible="icon" {...sidebarProps} className="bg-white">
			<SidebarHeader>
				<div className="flex overflow-hidden gap-1 items-center self-start py-px text-2xl font-black tracking-normal leading-none whitespace-nowrap min-h-[34px] text-neutral-800">
					<Image
						loading="lazy"
						src="/flare-cast-icon.svg"
						className="object-contain shrink-0 self-stretch my-auto w-8 aspect-square"
						alt="FlareCast logo"
						width={32}
						height={32}
					/>
					<div className="overflow-hidden self-stretch pb-1.5 my-auto w-[134px]">
						FlareCast
					</div>
				</div>
				<WorkspaceSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
