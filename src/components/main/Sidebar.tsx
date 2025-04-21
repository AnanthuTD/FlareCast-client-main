"use client";

import React, { useEffect, useState } from "react";
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
import { SpaceCard } from "./SpaceCard";
import Image from "next/image";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { fetchWorkspaces } from "@/actions/workspace";
import { getSpaces } from "@/actions/space";
import { toast } from "sonner";
import {
	getDefaultWorkspace,
	getLocalStorageWorkspace,
	setLocalStorageWorkspace,
} from "../InitializeWorkspaceStore";
import { CreateSpace } from "../global/create-space";
import { CreateWorkspace } from "../global/create-workspace";
import { GiftIcon, LucideIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { InviteMembers } from "../global/invite-members";

interface UserSidebarProps {
	sidebarItems: {
		icon: LucideIcon;
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

const Sidebar: React.FC<UserSidebarProps> = ({ sidebarItems }) => {
	const activeWorkspace = useWorkspaceStore((state) => state.selectedWorkspace);
	const workspaces = useWorkspaceStore((state) => state.workspaces);
	const setWorkspaces = useWorkspaceStore((state) => state.setWorkspaces);
	const setSelectedWorkspace = useWorkspaceStore(
		(store) => store.setSelectedWorkspace
	);
	const [spaces, setSpaces] = useState([]);

	useEffect(() => {
		fetchWorkspaces()
			.then((workspaces) => {
				const { member } = workspaces;

				const localStorageWorkspace = getLocalStorageWorkspace();
				const selectedWorkspace = getDefaultWorkspace(
					member,
					localStorageWorkspace?.id
				);

				setLocalStorageWorkspace(selectedWorkspace);

				setSelectedWorkspace(selectedWorkspace);

				console.log(selectedWorkspace);

				console.log("Fetched workspaces:", workspaces);
				setWorkspaces(workspaces);
			})
			.catch((error) => {
				console.error("Failed to fetch workspaces:", error);
				toast.error(`Fetching workspaces failed`);
			});
	}, [setSelectedWorkspace, setWorkspaces]);

	useEffect(() => {
		getSpaces(activeWorkspace.id)
			.then((spaces) => {
				console.log("Fetched spaces:", spaces);
				setSpaces(spaces);
			})
			.catch((error) => {
				console.error("Failed to fetch workspaces:", error);
				toast.error(`Fetching workspaces failed`);
			});
	}, [setSpaces, activeWorkspace.id]);

	console.log(activeWorkspace, workspaces);

	const onChangeActiveWorkspace = (value: string) => {
		console.log("==========================================");
		console.log("Workspace changed to ", value);
		console.log("==========================================");

		const selectedWorkspace = workspaces.member.find(
			(workspace) => workspace.id === value
		);

		if (selectedWorkspace) {
			setLocalStorageWorkspace(selectedWorkspace);
			setSelectedWorkspace(selectedWorkspace);
		}
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
									{activeWorkspace && workspaces.member.length > 0 && (
										<Select
											defaultValue={activeWorkspace.id}
											onValueChange={onChangeActiveWorkspace}
										>
											<SelectTrigger className="w-full text-neutral-400 bg-transparent">
												<SelectValue placeholder="Select a workspace"></SelectValue>
											</SelectTrigger>
											<SelectContent className="backdrop-blur-xl">
												<SelectGroup>
													<SelectLabel className="flex justify-between items-center">
														Workspaces <CreateWorkspace />{" "}
													</SelectLabel>
													<SelectSeparator />
													{/* TODO: fix this. this will duplicate. filter it */}
													{/* {workspaces.owned.map((workspace) => (
														<SelectItem value={workspace.id} key={workspace.id}>
															{workspace.name}{" "}
															<Badge className="ml-4" variant={"outline"}>
																owned
															</Badge>
														</SelectItem>
													))} */}
													{workspaces.member.map((workspace) => (
														<SelectItem value={workspace.id} key={workspace.id}>
															{workspace.name}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									)}
									<div className="text-xs tracking-normal leading-loose text-gray-500">
										1 member
									</div>
								</div>
							</div>
						</div>

						<Dialog>
							<DialogTrigger className="flex rounded-b-2xl overflow-hidden items-start py-2.5 pl-3.5 w-full text-xs font-medium tracking-normal leading-loose text-center border border-solid bg-teal-400 bg-opacity-20 border-teal-400 border-opacity-20 text-neutral-800 max-md:pr-5">
								<div className="flex gap-3 items-start py-1 pr-0.5 pl-1">
									<GiftIcon width={18} />
									<div>Invite Teammates</div>
								</div>
							</DialogTrigger>
							<DialogContent>
								<InviteMembers workspaceId={activeWorkspace.id} />
							</DialogContent>
						</Dialog>
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
								{/* <CreateWorkspace /> */}
								<CreateSpace />
							</div>

							{spaces.map(({ id, name, image = "" }) => (
								<SpaceCard key={id} name={name} avatar={image} id={id} />
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
