"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import React, { useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export interface NavItem {
	label: string;
	link: string;
	icon?: LucideIcon;
	isActive?: boolean;
	items?: {
		title: string;
		url: string;
	}[];
}

export function NavMain({ items }: { items: NavItem[] }) {
	const sidebarItemFactory = useCallback((item: NavItem) => {
		if (item.items && item.items.length > 0) {
			return (
				<>
					<CollapsibleTrigger asChild>
						<SidebarItem {...item} hasChild />
					</CollapsibleTrigger>
					<CollapsibleContent>
						<SidebarMenuSub>
							{item.items?.map((subItem) => (
								<SidebarMenuSubItem key={subItem.title}>
									<SidebarMenuSubButton asChild>
										<Link href={subItem.url}>
											<span>{subItem.title}</span>
										</Link>
									</SidebarMenuSubButton>
								</SidebarMenuSubItem>
							))}
						</SidebarMenuSub>
					</CollapsibleContent>
				</>
			);
		}

		return <SidebarItem {...item} />;
	}, []);

	return (
		<SidebarGroup>
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						key={item.label}
						asChild
						defaultOpen={item.isActive}
						className="group/collapsible"
					>
						<SidebarMenuItem>{sidebarItemFactory(item)}</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}

export const SidebarItem: React.FC<{
	icon?: LucideIcon;
	label: string;
	isActive?: boolean;
	notificationCount?: number;
	link: string;
	hasChild?: boolean;
}> = ({
	icon: Icon,
	label,
	isActive,
	notificationCount,
	link,
	hasChild = false,
}) => {
	const router = useRouter();
	const pathName = usePathname();
	const [isHovered, setIsHovered] = useState(false);

	const extendedClass =
		"text-indigo-500 bg-indigo-500 bg-opacity-10 rounded-[7992px]";
	const baseClasses =
		"font-bold py-1.5 pl-3 pr-2 text-black flex justify-between items-center text-sm leading-6 w-full";
	const activeClasses = isActive || pathName === link ? extendedClass : "";

	const handleNavigation = () => {
		router.push(link);
	};

	return (
		<SidebarMenuButton
			className={`${baseClasses} ${activeClasses} ${
				isHovered ? extendedClass : ""
			}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={handleNavigation}
			tooltip={label}
		>
			<div className="flex gap-2 items-start">
				{Icon && <Icon />}
				<div className="overflow-hidden pr-1">{label}</div>
			</div>

			<div className="flex gap-2">
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
				{hasChild && (
					<ChevronRight className="text-indigo-500 ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
				)}
			</div>
		</SidebarMenuButton>
	);
};
