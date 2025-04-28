"use client";

import { useState } from "react";
import { useMutationData } from "./useMutationData";
import { moveFolder } from "@/actions/folder";
import { Folder } from "@/types";

function useMoveFolder() {
	const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
	const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
	const [movingFolders, setMovingFolders] = useState<Set<string>>(new Set());

	const { mutate: moveFolderMutate } = useMutationData(
		["move-folder"],
		moveFolder,
		"workspace-folders",
		handleMoveSuccess,
		handleError
	);

	function handleError(error) {
		console.error(error);
		setMovingFolders((prev) => {
			const next = new Set(prev);
			next.delete(data.id);
			return next;
		});
	}

	function handleMoveSuccess(data: { id: string }) {
		setTimeout(
			() =>
				setMovingFolders((prev) => {
					const next = new Set(prev);
					next.delete(data.id);
					return next;
				}),
			3000
		);
	}

	function handleFolderMove(
		sourceId: string,
		destination: { type: "folder" | "workspace"; id: string }
	) {
		if (!sourceId || !destination.id || sourceId === destination.id) return;
		setMovingFolders((prev) => new Set([...prev, sourceId]));
		moveFolderMutate({
			folderId: sourceId,
			destination,
		});
	}

	return {
		selectedFolder,
		setSelectedFolder,
		dragOverFolderId,
		setDragOverFolderId,
		movingFolders,
		setMovingFolders,
		handleFolderMove,
	};
}

export default useMoveFolder;
