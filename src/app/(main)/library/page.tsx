"use client";

import React, { useEffect, useOptimistic, useState, useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoTab from "@/components/library/VideoTab";
import ArchiveTab from "@/components/library/ArchiveTab";
import ScreenshotTab from "@/components/library/ScreenshotTab";
import Folder from "@/components/library/folder/Folder";
import { Folder as FolderType } from "@/types";
import { createFolder, deleteFolder, fetchFolders } from "@/actions/folder";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface OptimisticFolder extends FolderType {
	optimistic: boolean;
}

const optimisticFolder: OptimisticFolder = {
	id: "temp-folder-id",
	name: "Untitled Folder",
	videoCount: 0,
	workspaceId: "activeWorkspace.id",
	optimistic: true,
};

export default function VideoLibrary() {
	const [folders, setFolders] = React.useState<FolderType[]>([]);
	const activeWorkspace = useWorkspaceStore((state) => state.selectedWorkspace);
	const [optimisticFolders, setOptimisticFolders] = useOptimistic(folders);
	const [isPending, startTransition] = useTransition();
	const [refetchFolders, setRefetchFolders] = useState(false)

	useEffect(() => {
		async function handleFetchFolders() {
			try {
				const data = await fetchFolders(activeWorkspace.id);
				setFolders(data);
			} catch (error) {
				toast.error(error?.message || `Failed to fetch folders`, {
					description: `Failed to fetch folders for workspace ${activeWorkspace.id}`,
				});
			}
		}

		handleFetchFolders();
	}, [activeWorkspace, refetchFolders]);

	const triggerRefetchFolders = () => setRefetchFolders(prev=>!prev)

	async function handleCreateFolder() {
		startTransition(async () => {
			try {
				setOptimisticFolders([optimisticFolder, ...folders]);

				const newFolder = await createFolder(activeWorkspace.id);
				toast.success(`Folder "${newFolder.name}" created successfully`, {
					description: `Folder "${newFolder.name}" created in workspace ${activeWorkspace.id}`,
				});

				setFolders([newFolder, ...folders]);
			} catch (error) {
				setFolders([...folders]);
			}
		});
	}

	async function handleDeleteFolder(folderId: string) {
		const folderToDelete = folders.find((folder) => folder.id === folderId);
		if (!folderToDelete) return;

		try {
			await deleteFolder(activeWorkspace.id, folderId);
			setFolders((prev) =>
				prev.filter((folder) => folder.id !== folderToDelete.id)
			);
			toast.success(`Folder "${folderToDelete.name}" deleted successfully`, {
				description: `Folder "${folderToDelete.name}" was deleted from workspace ${activeWorkspace.id}`,
			});
		} catch (error) {
			setFolders([...folders]);
			toast.error(error?.message || `Failed to delete folder`, {
				description: `Could not delete folder "${folderToDelete.name}" in workspace ${activeWorkspace.id}`,
			});
		}
	}

	return (
		<div className="flex flex-col px-10 py-6 max-md:px-5 w-full">
			<div className="flex flex-wrap gap-10 justify-between items-center w-full font-medium max-md:max-w-full">
				<div className="flex flex-col self-stretch my-auto w-[95px]">
					<div className="text-sm tracking-normal leading-loose text-gray-500">
						My Library
					</div>
					<div className="mt-1 text-3xl tracking-tighter leading-none text-neutral-800">
						Videos
					</div>
				</div>
				<div className="flex gap-2 items-center self-stretch my-auto text-sm tracking-normal leading-6 text-center">
					<button
						onClick={handleCreateFolder}
						className="self-stretch pt-1.5 pr-5 pb-2 pl-5 my-auto border border-solid border-gray-500 border-opacity-30 rounded-[7992px] text-neutral-800"
					>
						New folder
					</button>
					<button className="self-stretch px-5 pt-1.5 pb-2 my-auto text-white bg-indigo-500 rounded-[7992px]">
						New video
					</button>
				</div>
			</div>
			<div className="flex flex-col mt-8 w-full tracking-normal text-gray-500 max-md:max-w-full">
				<div className="flex flex-wrap gap-5 justify-between w-full max-md:max-w-full">
					<Tabs defaultValue="video" className="w-full">
						<TabsList>
							<TabsTrigger value="video">Video</TabsTrigger>
							<TabsTrigger value="archive">Archive</TabsTrigger>
							<TabsTrigger value="screenshot">Screenshot</TabsTrigger>
						</TabsList>
						<TabsContent value="video">
							<div className="flex flex-col mt-8 w-full max-md:max-w-full gap-10">
								<div className="flex flex-wrap gap-4">
									{optimisticFolders.map((folder) => (
										<Folder
											key={folder.id}
											{...folder}
											handleDelete={() => handleDeleteFolder(folder.id)}
											triggerRefetchFolders={triggerRefetchFolders}
										/>
									))}
								</div>
								<Separator />

								<div className="flex flex-col gap-4">
									<div className="text-lg font-medium tracking-tight leading-loose text-neutral-800">
										Videos
									</div>
									<VideoTab />
								</div>
							</div>
						</TabsContent>
						<TabsContent value="archive">
							<div className="flex flex-col mt-8 w-full max-md:max-w-full">
								<div className="text-lg font-medium tracking-tight leading-loose text-neutral-800">
									Archive
								</div>
								<ArchiveTab />
							</div>
						</TabsContent>
						<TabsContent value="screenshot">
							<div className="flex flex-col mt-8 w-full max-md:max-w-full">
								<div className="text-lg font-medium tracking-tight leading-loose text-neutral-800">
									Screenshots
								</div>
								<ScreenshotTab />
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
