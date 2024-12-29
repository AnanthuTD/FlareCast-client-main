"use client";

import React from "react";
import {
	Select,
	SelectLabel,
	SelectContent,
	SelectTrigger,
	SelectSeparator,
	SelectValue,
	SelectGroup,
	SelectItem,
} from "../ui/select";
import { SidebarItem } from "./SidebarItem";
import { Workspace } from "./Workspace";
import Image from "next/image";

interface UserSidebarProps {
	sidebarItems: {
		icon: string;
		label: string;
		isActive?: boolean;
		link: string;
		notificationCount?: number;
	}[];
	workspaces: {
		id: string;
		name: string;
		memberCount: number;
		avatarLabel: string;
	}[];
	activeWorkspaceId: string;
}

const Sidebar: React.FC<UserSidebarProps> = ({
	workspaces,
	sidebarItems,
	activeWorkspaceId,
}) => {
	const onChangeActiveWorkspace = (value: string) => {
		console.log("==========================================");
		console.log("Workspace changed to ", value);
		console.log("==========================================");
	};

	return (
		<>
			<div className="flex gap-2.5 items-center w-60 bg-white">
				<div className="flex flex-col flex-1 shrink self-stretch px-2.5 py-5 my-auto w-full basis-0">
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

					<div className="flex flex-col mt-3 w-full bg-white">
						<div className="flex overflow-hidden items-start py-2.5 pr-3.5 pl-4 w-full bg-white rounded-t-2xl border border-solid border-gray-500 border-opacity-20">
							<div className="flex items-center justify-between w-full">
								<div className="flex flex-col self-stretch my-auto w-full">
									<Select
										defaultValue={activeWorkspaceId}
										onValueChange={onChangeActiveWorkspace}
									>
										<SelectTrigger className="w-full text-neutral-400 bg-transparent">
											<SelectValue placeholder="Select a workspace"></SelectValue>
										</SelectTrigger>
										<SelectContent className="backdrop-blur-xl">
											<SelectGroup>
												<SelectLabel>Workspaces</SelectLabel>
												<SelectSeparator />
												{[{ id: "workspace_id", name: "workspace_name" }].map(
													(workspace) => (
														<SelectItem value={workspace.id} key={workspace.id}>
															{workspace.name}
														</SelectItem>
													)
												)}
												{[{}].length > 0 &&
													[
														{
															WorkSpace: { id: "id", name: "workspace_name" },
														},
													].map(
														(workspace) =>
															workspace.WorkSpace && (
																<SelectItem
																	value={workspace.WorkSpace.id}
																	key={workspace.WorkSpace.id}
																>
																	{workspace.WorkSpace.name}
																</SelectItem>
															)
													)}
											</SelectGroup>
										</SelectContent>
									</Select>
									<div className="text-xs tracking-normal leading-loose text-gray-500">
										1 member
									</div>
								</div>
							</div>
						</div>

						<button
							onClick={() => {
								alert("Invite Teammates not defined!");
							}}
							className="flex rounded-b-2xl overflow-hidden items-start py-2.5 pl-3.5 w-full text-xs font-medium tracking-normal leading-loose text-center border border-solid bg-teal-400 bg-opacity-20 border-teal-400 border-opacity-20 text-neutral-800 max-md:pr-5"
						>
							<div className="flex gap-3 items-start py-1 pr-0.5 pl-1">
								<img
									loading="lazy"
									src="https://cdn.builder.io/api/v1/image/assets/TEMP/c50b51837989b4b9298d5227a91a051b72b0ef995129f99a0317e92377b6bd29?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
									className="object-contain shrink-0 aspect-square w-[18px]"
									alt=""
								/>
								<div>Invite Teammates</div>
							</div>
						</button>
					</div>

					<nav className="flex overflow-hidden items-start py-6 mt-3 w-full font-medium tracking-normal">
						<div className="flex flex-col flex-1 shrink w-full basis-0">
							<div className="flex flex-col items-start w-full">
								{sidebarItems.map((item, index) => (
									<SidebarItem key={index} {...item} />
								))}
							</div>

							<div className="flex mt-6 w-full border-b border-gray-500 border-opacity-20 min-h-[1px]" />

							<div className="flex gap-5 justify-between py-px pr-2 mt-6 w-full text-sm leading-6 text-gray-500 whitespace-nowrap">
								<div>Workspaces</div>
								<img
									loading="lazy"
									src="https://cdn.builder.io/api/v1/image/assets/TEMP/8a628cca0b149520d7c43e0a0fedd89fd3d0b983ec19b33d421b9bccb9feefc4?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
									className="object-contain shrink-0 my-auto aspect-square w-[18px]"
									alt=""
								/>
							</div>

							{workspaces.map((workspace, index) => (
								<Workspace key={index} {...workspace} />
							))}

							<div className="flex mt-6 w-full border-b border-gray-500 border-opacity-20 min-h-[1px]" />
						</div>
					</nav>
				</div>
			</div>
		</>
	);
};

export default Sidebar;
