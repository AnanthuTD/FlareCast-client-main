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
	selectedFolder: FolderType | null;
	setSelectedFolder: (folder: FolderType | null) => void;
	dragOverFolderId: string | null;
	setDragOverFolderId: (folderId: string | null) => void;
	onMoveFolder: (
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
	dragOverFolderId,
	movingFolders,
	onMoveFolder,
	selectedFolder,
	setDragOverFolderId,
	setSelectedFolder,
}) => {
	const { latestVariables: latestFolder } = useMutationDataState([
		"create-folder",
	]);

	function handleDragStart(ev: DragEvent<HTMLDivElement>) {
		const folder = folders.find((f) => f.id === ev.currentTarget.id);
		setSelectedFolder(folder ?? null);
	}

	function handleDragEnter(ev: DragEvent<HTMLDivElement>) {
		ev.preventDefault();
		const folderId = ev.currentTarget.id;

		if (
			!folderId ||
			folderId === selectedFolder?.id ||
			!ev.currentTarget.classList.contains("folder")
		) {
			setDragOverFolderId(null);
			ev.currentTarget.classList.add(styles.nonDroppable);
			ev.dataTransfer.dropEffect = "none";
			return;
		}

		ev.currentTarget.classList.remove(styles.nonDroppable);
		ev.dataTransfer.dropEffect = "move";
		setDragOverFolderId(folderId);
	}

	function handleDrop(ev: DragEvent<HTMLDivElement>) {
		ev.preventDefault();
		const targetFolderId = dragOverFolderId;

		if (
			selectedFolder &&
			targetFolderId &&
			selectedFolder.id !== targetFolderId
		) {
			onMoveFolder(selectedFolder.id, {
				type: "folder",
				id: targetFolderId,
			});
		}

		setSelectedFolder(null);
		setDragOverFolderId(null);
		ev.currentTarget.classList.remove(styles.nonDroppable);
	}

	function handleDragLeave(ev: DragEvent<HTMLDivElement>) {
		ev.currentTarget.classList.remove(styles.nonDroppable);
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
							optimistic={folder.id === selectedFolder?.id}
							onDragStart={handleDragStart}
							onDragEnter={handleDragEnter}
							onDragEnd={handleDrop}
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
