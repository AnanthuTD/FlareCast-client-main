"use client";

import * as React from "react";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { CreateWorkspace } from "../global/create-workspace";
import {
	getDefaultWorkspace,
	getLocalStorageWorkspace,
	setLocalStorageWorkspace,
} from "../InitializeWorkspaceStore";
import { toast } from "sonner";
import { fetchWorkspaces, getMembers } from "@/actions/workspace";
import { useQuery } from "@tanstack/react-query";

export function WorkspaceSwitcher({}: {}) {
	const { isMobile } = useSidebar();
	const activeWorkspace = useWorkspaceStore((state) => state.selectedWorkspace);
	const workspaces = useWorkspaceStore((state) => state.workspaces);

	const setWorkspaces = useWorkspaceStore((state) => state.setWorkspaces);
	const setSelectedWorkspace = useWorkspaceStore(
		(store) => store.setSelectedWorkspace
	);

	React.useEffect(() => {
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

				setWorkspaces(workspaces);
			})
			.catch((error) => {
				console.error("Failed to fetch workspaces:", error);
				toast.error(`Fetching workspaces failed`);
			});
	}, [setSelectedWorkspace, setWorkspaces]);

	const onChangeActiveWorkspace = (value: string) => {
		const selectedWorkspace = workspaces.member.find(
			(workspace) => workspace.id === value
		);

		if (selectedWorkspace) {
			setLocalStorageWorkspace(selectedWorkspace);
			setSelectedWorkspace(selectedWorkspace);
		}
	};

	const { data: workspaceMembers } = useQuery({
		placeholderData: [],
		queryKey: ["workspace-members", activeWorkspace?.id],
		queryFn: async () => await getMembers(activeWorkspace!.id),
	});

	return (
		<SidebarMenu>
			<SidebarMenuItem>
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
									{workspaceMembers.length} member
								</div>
							</div>
						</div>
					</div>

					{/* <button
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
					</button> */}
				</div>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
