"use client";

import React, { DragEvent } from "react";
import { Separator } from "@/components/ui/separator";
import { useMutationDataState } from "@/hooks/useMutationData";
import { Folder as FolderType } from "@/types";
import Folder from "./Folder";
import styles from "./folderList.module.css";

type FolderListProps = {
	folders: FolderType[];
	fetchNextPage: () => void;
	hasNextPage?: boolean;
	isFetchingNextPage: boolean;
	dragOverFolderId: string | null;
	setDragOverFolderId: (folderId: string | null) => void;
	onMoveFolder: (
		sourceId: string,
		destination: { type: "folder" | "workspace"; id: string }
	) => void;
	onMoveVideo: (
		sourceId: string,
		destination: { type: "folder" | "workspace"; id: string }
	) => void;
	movingFolders: Set<string>;
};

export const FolderList: React.FC<FolderListProps> = ({
	folders,
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
	movingFolders,
	onMoveFolder,
	setDragOverFolderId,
	onMoveVideo,
}) => {
	const { latestVariables: latestFolder } = useMutationDataState([
		"create-folder",
	]);

	function handleDragStart(ev: DragEvent<HTMLDivElement>) {
		const folderId = ev.currentTarget.id;
		ev.dataTransfer.setData("type", "folder");
		ev.dataTransfer.setData("folderId", folderId);
	}

	function handleDragEnter(ev: DragEvent<HTMLDivElement>) {
		ev.preventDefault();
		const folderId = ev.currentTarget.id;
		const componentType = ev.dataTransfer.getData("type");

		if (componentType === "video" || !folderId) {
			setDragOverFolderId(null);
			return;
		}

		const selectedFolderId = ev.dataTransfer.getData("folderId");

		if (
			componentType !== "folder" ||
			!folderId ||
			folderId === selectedFolderId ||
			!ev.currentTarget.classList.contains("folder")
		) {
			setDragOverFolderId(null);
			return;
		}

		setDragOverFolderId(folderId);
	}

	function handleDrop(ev: DragEvent<HTMLDivElement>) {
		ev.preventDefault();
		const targetFolderId = ev.currentTarget.id;

		if (!targetFolderId) {
			setDragOverFolderId(null);
			return;
		}

		const componentType = ev.dataTransfer.getData("type");

		if (componentType === "video") {
			const videoId = ev.dataTransfer.getData("videoId");

			if (!videoId) {
				console.warn(
					"🔴 'videoId' is missing in dataTransfer for type 'video'"
				);
			} else {
				onMoveVideo(videoId, {
					type: "folder",
					id: targetFolderId,
				});
			}
		} else if (componentType === "folder") {
			const selectedFolderId = ev.dataTransfer.getData("folderId");
			if (selectedFolderId !== targetFolderId) {
				onMoveFolder(selectedFolderId, {
					type: "folder",
					id: targetFolderId,
				});
			}
		} else {
			console.warn(`⚠️ Unknown component type dropped: ${componentType}`);
		}

		setDragOverFolderId(null);
	}

	function handleDragLeave(ev: DragEvent<HTMLDivElement>) {
		ev.preventDefault();
	}

	return (
		<div className="flex flex-col mt-8 w-full max-md:max-w-full gap-10">
			<div className="flex flex-wrap gap-4">
				{latestFolder && latestFolder.status === "pending" && (
					<Folder {...latestFolder.variables} optimistic />
				)}
				{folders.length > 0 ? (
					folders.map((folder) => (
						<Folder
							{...folder}
							key={folder.id}
							draggable
							hide={movingFolders.has(folder.id)}
							onDragStart={handleDragStart}
							onDragEnter={handleDragEnter}
							onDrop={handleDrop}
							onDragLeave={handleDragLeave}
						/>
					))
				) : (
					<p className="text-secondary">No Folders Found</p>
				)}
			</div>
			{hasNextPage && (
				<div className="flex justify-end mt-4">
					<button
						onClick={fetchNextPage}
						disabled={isFetchingNextPage}
						className="text-sm text-muted-foreground hover:underline disabled:opacity-50 transition"
					>
						{isFetchingNextPage ? "Loading..." : "Show more"}
					</button>
				</div>
			)}
			<Separator />
		</div>
	);
};
