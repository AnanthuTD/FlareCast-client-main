"use client";

import React, { DragEvent, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useMutationData, useMutationDataState } from "@/hooks/useMutationData";
import { Folder as FolderType } from "@/types";
import Folder from "./Folder";
import { moveFolder } from "@/actions/folder";
import styles from "./folderList.module.css";

type FolderListProps = {
	folders: FolderType[];
	fetchNextPage: () => void;
	hasNextPage?: boolean;
	isFetchingNextPage: boolean;
};

export const FolderList: React.FC<FolderListProps> = ({
	folders,
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
}) => {
	const { latestVariables: latestFolder } = useMutationDataState([
		"create-folder",
	]);
	const [dragOver, setDragOver] = useState<null | string>(null);
	const [selectedFolder, setSelectedFolder] = useState<null | FolderType>(null);
	const [movingFolders, setMovingFolders] = useState<Set<string>>(new Set());

	const { mutate, isPending } = useMutationData(
		["move-folder"],
		moveFolder,
		"workspace-folders",
		handleMoveSuccess
	);

	function handleMoveSuccess(data) {
		if (data)
			setMovingFolders((prev) => {
				prev.delete(data.id);
				return new Set(prev);
			});
	}

	function handleDragStart(ev: DragEvent<HTMLDivElement>) {
		console.log("ℹ️ Drag start");
		const folder = folders.find((f) => f.id === ev.currentTarget.id);
		setSelectedFolder(folder ?? null);
	}

	function handleDragEnter(ev: DragEvent<HTMLDivElement>) {
		ev.preventDefault();
		console.log("ℹ️ Drag enter", ev.currentTarget.id);

		if (
			!ev.currentTarget.id ||
			ev.currentTarget.id === selectedFolder?.id ||
			!ev.currentTarget.classList.contains("folder")
		) {
			setDragOver(null);
			ev.currentTarget.classList.add(styles.nonDroppable);
			return;
		}

		ev.currentTarget.classList.remove(styles.nonDroppable);
		setDragOver(ev.currentTarget.id);
	}

	function handleDrop(ev: DragEvent<HTMLDivElement>) {
		ev.preventDefault();
		console.log("ℹ️ Drag drop");
		console.log(selectedFolder, dragOver);

		if (selectedFolder && dragOver && selectedFolder.id !== dragOver) {
			setMovingFolders((prev) => new Set([...prev, selectedFolder.id]));
			// start mutation
			mutate({
				folderId: selectedFolder.id,
				destination: {
					type: "folder",
					id: dragOver,
				},
			});
		}

		setSelectedFolder(null);
		setDragOver(null);
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
					folders.map((folder) => {
						return (
							<Folder
								{...folder}
								key={folder.id}
								hide={movingFolders.has(folder.id) && isPending}
								optimistic={folder.id === selectedFolder?.id}
								draggable
								onDragStart={handleDragStart}
								onDragEnter={handleDragEnter}
								onDragEnd={handleDrop}
								onDragLeave={handleDragLeave}
							/>
						);
					})
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
